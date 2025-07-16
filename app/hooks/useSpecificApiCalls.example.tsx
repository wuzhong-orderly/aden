// Example of moving the logic to specific API calls instead of global interception

import { useOptimizedApiCalls } from '@/hooks/useOptimizedApiCalls';

// In your API service files:
export const useFuturesAPI = () => {
    const { filterFuturesData, enhancedFetch } = useOptimizedApiCalls();

    const getFutures = async () => {
        try {
            const response = await enhancedFetch('/v1/public/futures');
            return await response.json();
        } catch (error) {
            console.error('Futures API error:', error);
            throw error;
        }
    };

    return { getFutures };
};

export const useTokenAPI = () => {
    const { reorderTokenChains, enhancedFetch } = useOptimizedApiCalls();

    const getTokens = async () => {
        try {
            const response = await enhancedFetch('/v1/public/token');
            return await response.json();
        } catch (error) {
            console.error('Token API error:', error);
            throw error;
        }
    };

    return { getTokens };
};
