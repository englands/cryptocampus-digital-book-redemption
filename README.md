# CryptoCampus - Digital Book Redemption DApp

CryptoCampus is a decentralized application (DApp) that allows users to redeem digital books using an ERC20 token (BOOK). Built with a sleek, OpenSea-inspired dark mode UI, it provides a seamless bridge between blockchain assets and digital content consumption.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fenglands%2Fcryptocampus-digital-book-redemption)

## 🌟 Overview

CryptoCampus leverages the Binance Smart Chain (BSC) and FlexSmart testnet to offer a high-performance, low-cost environment for book enthusiasts. Users can manage their token balances, browse a curated collection of digital literature, and instantly redeem titles to their personal library with a single transaction.

### Key Features

- **Redemption Flow**: Effortlessly swap 1 BOOK token for permanent access to digital titles.
- **'My Library' Dashboard**: A centralized hub to view your collection, check token balances, and access owned content.
- **On-Chain Verification**: Dedicated verification page to prove ownership and authenticity of any digital asset via the blockchain.
- **Social Integration**: Integrated 'Share on X' functionality to showcase your latest acquisitions to the community.
- **Modern UI/UX**: Charcoal-themed dark mode with teal accents, featuring smooth Framer Motion animations and responsive layouts for mobile and desktop.
- **Secure Connectivity**: Robust wallet integration for MetaMask and other Web3 providers.

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI, Lucide Icons
- **Animations**: Framer Motion
- **Blockchain**: Ethers.js, Wagmi/Viem
- **Backend/Storage**: Cloudflare Workers, Durable Objects (GlobalDurableObject)
- **State Management**: Zustand
- **Routing**: React Router 6

## 🚀 Getting Started

### Prerequisites

You will need [Bun](https://bun.sh/) installed on your local machine to run this project.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cryptocampus-dapp
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:3000`.

## 📖 Usage

### Connecting Your Wallet
Click the **Connect Wallet** button in the header. Ensure your provider is set to the **Binance Smart Chain** or the **FlexSmart Testnet**.

### Redeeming a Book
1. Browse the available books on the Home page.
2. Click **Redeem** on your chosen title.
3. Confirm the transaction in your wallet (Cost: 1 BOOK token).
4. Once confirmed, the book will appear in your **My Library** section.

### Sharing Your Collection
In your library, click the **Share on X** button on any book card to generate a pre-filled post: *"Just unlocked a new book using CryptoCampus! #CryptoCampus #Web3"*.

## 🏗️ Development

### Project Structure
- `src/pages`: Contains the main view components (Home, Library, Verify).
- `src/components`: Reusable UI components built on Shadcn primitives.
- `worker/`: Cloudflare Worker logic and Durable Object entity definitions.
- `shared/`: Shared TypeScript types and mock data definitions.

### Smart Contract Information
- **Token Address**: `0x849868846635300B4413e85adcFD0a057c675B8e`
- **Network**: BSC / FlexSmart Testnet

## 🌐 Deployment

This project is optimized for deployment on Cloudflare Pages and Workers.

### Manual Deployment
```bash
bun run deploy
```

### One-Click Deploy
You can deploy your own instance of CryptoCampus directly to Cloudflare using the button below:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fenglands%2Fcryptocampus-digital-book-redemption)

---

Built with precision by the Aurelia Expert Engineering Team.