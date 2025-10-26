# 🌍 Transparent Philanthropy Chain (TPC)

> Empowering charitable giving with blockchain transparency and accountability.

TPC is a decentralized philanthropy platform built with **Clarity** smart contracts on the **Stacks** blockchain. It enables verifiable charitable giving where **STX tokens** are held in escrow until impact verification. This creates a trustless system where donors' funds are protected and charities are accountable for their promised deliverables.

## ✨ Core Features
- **Smart Contract Security**: Funds are securely escrowed in Clarity contracts
- **Verified Charities**: On-chain registration system for legitimate organizations
- **Campaign Management**: Fundraising campaigns with specific goals and deadlines
- **Impact Verification**: Two-step verification process with proof submission and verification
- **Donor Protection**: Automatic refund system if campaign goals aren't met
- **Transparent Tracking**: Real-time campaign progress monitoring
- **Decentralized Verification**: Independent verifiers ensure accountability

## 🧱 Smart Contract Architecture (`contracts/tpc.clar`)
Key public functions:
- `register-charity(name, info)`: Register new charitable organizations
- `create-campaign(goal, deadline, description, verifier)`: Launch fundraising campaigns
- `donate(id)`: Make STX donations to campaigns
- `submit-proof(id, hash)`: Submit proof of impact via IPFS hash
- `verify-and-release(id)`: Verifier approves and releases funds
- `refund(id)`: Return funds if deadline passes without verification

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
