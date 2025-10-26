# 🌍 Transparent Philanthropy Chain (TPC)

> Building trust in charitable giving through blockchain transparency and smart verification

TPC revolutionizes charitable donations by combining the security of **Stacks blockchain** with a user-friendly interface for transparent giving. Our platform ensures that every donation is traceable, verifiable, and reaches its intended beneficiaries through a robust escrow and verification system.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stacks](https://img.shields.io/badge/Stacks-Blockchain-purple)](https://www.stacks.co/)
[![Clarity](https://img.shields.io/badge/Smart%20Contracts-Clarity-blue)](https://clarity-lang.org/)

## 🎯 Why TPC?

In traditional charitable giving, donors often lack visibility into how their funds are used. TPC solves this by:

- **🔒 Secure Escrow**: All donations are held in smart contracts until verified
- **✅ Verifiable Impact**: Third-party verification of charitable outcomes
- **💰 Donor Protection**: Automatic refunds if projects don't meet goals
- **📊 Real-time Tracking**: Monitor campaign progress and fund usage
- **🤝 Trust Building**: Transparent, immutable record of all transactions

## 🛠️ Technical Architecture

### Smart Contracts (`contracts/tpc.clar`)

```clarity
;; Key Functions
(define-public (register-charity (name (string-ascii 64)) (info (string-ascii 256)))
(define-public (create-campaign (goal uint) (deadline uint) (description (string-utf8 256)) (verifier principal))
(define-public (donate (id uint))
(define-public (submit-proof (id uint) (hash (string-utf8 256)))
(define-public (verify-and-release (id uint))
(define-public (refund (id uint))
```

### Frontend Stack

- **🎨 UI**: React 18 with Tailwind CSS
- **🔗 Blockchain**: Stacks.js for chain interaction
- **🏗️ Build**: Vite for blazing-fast development
- **📱 Design**: Responsive, mobile-first approach

## 🔬 Run Tests
```bash
npm i -g @hirosystems/clarinet
clarinet test


---

# 🧩 Frontend Application

> A React-based DApp interface for interacting with the TPC smart contract. Built with Vite for optimal development experience.

## 🔧 Setup & Development
1. Configure environment variables in `.env`:
   ```
   VITE_CONTRACT_ADDRESS=your_deployed_contract_address
   VITE_CONTRACT_NAME=your_contract_name
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## � Deployment Guide

### 1. Contract Deployment to Testnet

1. Install Clarinet if not already installed:
   ```bash
   choco install clarinet    # Windows with Chocolatey
   # OR download from https://www.hiro.so/clarinet
   ```

2. Set up your Testnet wallet:
   - Create a new wallet on Hiro Wallet (https://wallet.hiro.so)
   - Switch to Testnet network
   - Get test STX from faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet

3. Configure deployment settings:
   - Edit `settings/Testnet.toml`
   - Replace `<YOUR PRIVATE TESTNET MNEMONIC HERE>` with your wallet's seed phrase
   - Ensure you have enough testnet STX for deployment

4. Deploy the contract:
   ```bash
   clarinet deploy --testnet
   ```
   - Save the contract address and ID from deployment output

### 2. Frontend Configuration

1. Create frontend environment file:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Update `.env` with deployment details:
   ```
   VITE_CONTRACT_ADDRESS=<your_deployed_contract_address>
   VITE_CONTRACT_NAME=tpc
   ```

3. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```

### 3. Testing the Deployment

1. Connect Hiro Wallet to your DApp
2. Try registering a test charity
3. Create a test campaign
4. Make a test donation

### 4. Important Contract Details

- **Network**: Stacks Testnet
- **Contract Address**: Your deployed contract address
- **Contract Name**: tpc
- **Explorer**: https://explorer.hiro.so/txid/<TRANSACTION_ID>?chain=testnet

## �📦 Technology Stack

```json
{
  "name": "tpc-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 4173"
  },
  "dependencies": {
    "@stacks/connect": "^7.7.1",
    "@stacks/network": "^6.13.0",
    "@stacks/transactions": "^6.13.0",
    "buffer": "^6.0.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.6.3",
    "vite": "^5.4.10"
  }
}
