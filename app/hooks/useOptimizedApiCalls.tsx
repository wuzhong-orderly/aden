import { useMemo } from 'react';

// TypeScript interfaces
interface FuturesPair {
    symbol: string;
    [key: string]: any;
}

interface ChainDetail {
    chain_id: string;
    [key: string]: any;
}

interface TokenRow {
    chain_details?: ChainDetail[];
    [key: string]: any;
}

interface ApiResponseData {
    rows: FuturesPair[] | TokenRow[];
    [key: string]: any;
}

interface ApiResponse {
    success?: boolean;
    data?: ApiResponseData;
    [key: string]: any;
}

// Desired chain order
const desiredChainOrder = [
    56,        // BNB Smart Chain
    1,         // Ethereum
    900900900, // Solana
    42161,     // Arbitrum
    8453,      // Base
];

/**
 * Alternative to useApiInterceptor that doesn't override global fetch
 * This provides utility functions to process API responses without intercepting
 */
export const useOptimizedApiCalls = () => {
    // Cache allowed tokens computation
    const allowedTokens = useMemo(() => {
        const tokensEnv = import.meta.env.VITE_ALLOWED_TOKENS;
        return tokensEnv?.split(',').map((token: string) => token.trim()).filter(Boolean) || [];
    }, []);

    const hasTokenFilter = allowedTokens.length > 0;

    // Memoized filter function for futures data
    const filterFuturesData = useMemo(() => {
        if (!hasTokenFilter) return null;

        return (data: ApiResponse): ApiResponse => {
            if (!data.data?.rows) return data;

            const filteredRows = (data.data.rows as FuturesPair[]).filter((pair: FuturesPair) => {
                const symbol = pair.symbol;
                const tokenPart = symbol.replace('PERP_', '').replace(/_USD[CT]$/, '');
                return allowedTokens.includes(tokenPart);
            });

            return {
                ...data,
                data: {
                    ...data.data,
                    rows: filteredRows
                }
            };
        };
    }, [allowedTokens, hasTokenFilter]);

    // Memoized reorder function for token data
    const reorderTokenChains = useMemo(() => {
        return (data: ApiResponse): ApiResponse => {
            if (!data.success || !data.data?.rows) return data;

            const reorderedRows = (data.data.rows as TokenRow[]).map((tokenRow: TokenRow) => {
                if (!tokenRow.chain_details || !Array.isArray(tokenRow.chain_details)) {
                    return tokenRow;
                }

                const chainDetailsMap = new Map<number, ChainDetail>();
                tokenRow.chain_details.forEach((detail: ChainDetail) => {
                    chainDetailsMap.set(parseInt(detail.chain_id), detail);
                });

                const reorderedChainDetails: ChainDetail[] = [];

                // Add priority chains first
                desiredChainOrder.forEach(chainId => {
                    const detail = chainDetailsMap.get(chainId);
                    if (detail) {
                        reorderedChainDetails.push(detail);
                        chainDetailsMap.delete(chainId);
                    }
                });

                // Add remaining chains
                chainDetailsMap.forEach(detail => {
                    reorderedChainDetails.push(detail);
                });

                return {
                    ...tokenRow,
                    chain_details: reorderedChainDetails
                };
            });

            return {
                ...data,
                data: {
                    ...data.data,
                    rows: reorderedRows
                }
            };
        };
    }, []);

    // Enhanced fetch function that can replace the interceptor
    const enhancedFetch = useMemo(() => {
        return async (url: string, options?: RequestInit): Promise<Response> => {
            const response = await fetch(url, options);

            // Quick exit for non-matching URLs
            const isFuturesAPI = url.includes('/v1/public/futures');
            const isTokenAPI = url.includes('/v1/public/token');

            if (!isFuturesAPI && !isTokenAPI) return response;

            try {
                const data = await response.clone().json() as ApiResponse;
                let processedData = data;

                if (isFuturesAPI && filterFuturesData) {
                    processedData = filterFuturesData(data);
                }

                if (isTokenAPI) {
                    processedData = reorderTokenChains(processedData);
                }

                // Only create new response if data was actually modified
                if (processedData !== data) {
                    return new Response(JSON.stringify(processedData), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }

                return response;
            } catch (error) {
                console.error('Error in enhanced fetch:', error);
                return response;
            }
        };
    }, [filterFuturesData, reorderTokenChains]);

    return {
        allowedTokens,
        hasTokenFilter,
        filterFuturesData,
        reorderTokenChains,
        enhancedFetch
    };
};
