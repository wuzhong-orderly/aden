# Orderly Broker UI Template

This template provides a quick way to set up a customized trading UI for Orderly Network brokers, built with Remix and deployable on GitHub Pages.

## Quick Start

1. **Fork the Repository**
   
   Fork this repository to your GitHub account to create your broker's UI.

2. **Clone Your Fork**

```sh
git clone https://github.com/YOUR_USERNAME/broker-template.git
cd broker-template
```

3. **Install Dependencies**

```sh
yarn install
```

## Configuration Steps

### 1. Broker Configuration

Edit the `.env` file to set up your broker details:

```env
VITE_ORDERLY_BROKER_ID=your_broker_id
VITE_ORDERLY_BROKER_NAME=Your Broker Name
VITE_ORDERLY_NETWORK_ID=mainnet  # or testnet for testing
```

### 2. Theme Customization

1. Visit the [Orderly Storybook Trading Page](https://storybook.orderly.network/?path=/story/package-trading-tradingpage--page)
2. Customize your preferred theme using the controls
3. Export the generated CSS
4. Replace the contents of `app/styles/theme.css` with your exported CSS

### 3. UI Configuration

Edit `app/utils/config.tsx` to customize your UI:

- **Footer Links**: Update `footerProps` with your social media links
- **Logos**: Replace the main and secondary logos in the `appIcons` section
- **PnL Sharing**: Customize the PnL poster backgrounds and colors in `sharePnLConfig`

Required assets:
- Place your logos in the `public` directory:
  - Main logo: `public/orderly-logo.svg`
  - Secondary logo: `public/orderly-logo-secondary.svg`
  - Favicon: `public/favicon.png`
- PnL sharing backgrounds: `public/pnl/poster_bg_[1-4].png`

## Development

Run the development server:

```sh
yarn dev
```

## Deployment

1. Build the application:

```sh
yarn build
```

2. Base URL Configuration:

The base URL configuration depends on your deployment method:

- **For GitHub Pages subdirectory deployment** (`https://your-username.github.io/broker-template/`):
  Keep the basename configuration in `vite.config.ts`:
  ```typescript
  // vite.config.ts
  remix({
    basename: "/your-repo-name",  // Change this to match your repository name
    // ... other options
  })
  ```

- **For custom domain deployment** (`https://your-domain.com`):
  Remove the basename configuration in `vite.config.ts`:
  ```typescript
  // vite.config.ts
  remix({
    // basename: "/your-repo-name",  // Remove or comment out this line
    // ... other options
  })
  ```

3. Deploy to GitHub Pages:
   - Enable GitHub Pages in your repository settings
   - Set the build and deployment source to branch (not GitHub Actions)
   - Select the branch you want to deploy (typically `gh-pages` or `main`)
   - For custom domain setup, follow the [GitHub Pages custom domain configuration guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Additional Resources

- [Orderly JS SDK Documentation](https://github.com/OrderlyNetwork/js-sdk)
- [Orderly Network Documentation](https://orderly.network/docs/sdks)
- [Storybook Theme Editor](https://storybook.orderly.network/?path=/story/package-trading-tradingpage--page)

