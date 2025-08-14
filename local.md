# EventPass: Local Deployment Guide

This guide provides a consolidated, step-by-step process to set up and run the EventPass NFT Event Ticketing dApp on your local laptop. It covers all prerequisites, necessary code replacements, and commands to get the project fully operational in your local development environment.

## Overview

EventPass is a full-stack Web3 application. To run it locally, you will need to set up three main components:
1.  **Move Smart Contract**: This contract lives on the Aptos blockchain (we'll use the Testnet for local development).
2.  **Backend API**: A Node.js Express server that manages event registrations and interacts with the database.
3.  **Frontend Website**: A React application that provides the user interface, connects to your wallet, and interacts with both the backend API and the Aptos blockchain.

## 1. Prerequisites: Prepare Your Local Environment

Before you begin, ensure your system has the following tools installed. If not, follow the installation instructions provided.

### 1.1 Node.js (version 18.0 or higher)

Node.js is the JavaScript runtime for both your backend API and frontend development server.

*   **How to Check**: Open your terminal/command prompt and run:
    ```bash
    node -v
    ```
    Expected output: `v18.x.x` or higher.

*   **How to Install (if needed)**:
    *   **Recommended (NVM - Node Version Manager)**: NVM allows easy switching between Node.js versions.
        1.  Install NVM: Follow instructions at [https://github.com/nvm-sh/nvm#installing-and-updating](https://github.com/nvm-sh/nvm#installing-and-updating)
        2.  After NVM installation, close and reopen your terminal, then run:
            ```bash
            nvm install 18
            nvm use 18
            nvm alias default 18 # Optional: set Node 18 as default
            ```
    *   **Direct Download**: Visit the official Node.js website ([https://nodejs.org/en/download/](https://nodejs.org/en/download/)) and download the LTS (Long Term Support) version for your OS.

### 1.2 npm or pnpm (Package Manager)

These manage project dependencies. `pnpm` is generally faster and more efficient.

*   **How to Check**: Open your terminal and run:
    ```bash
    npm -v
    # OR
    pnpm -v
    ```
    You should see a version number.

*   **How to Install (if needed)**:
    *   `npm`: Usually comes bundled with Node.js. If Node.js is installed, `npm` should be available.
    *   `pnpm` (Recommended): Install globally using npm:
        ```bash
        npm install -g pnpm
        ```

### 1.3 Aptos CLI

The Aptos Command Line Interface is used to interact with the Aptos blockchain, including deploying your smart contract and managing your Aptos account.

*   **How to Check**: Open your terminal and run:
    ```bash
    aptos --version
    ```
    You should see the Aptos CLI version (e.g., `aptos 0.1.0`).

*   **How to Install (if needed)**:
    *   **Recommended**: Use the official installation script:
        ```bash
        curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
        ```
        Refer to the official Aptos documentation for detailed, OS-specific instructions: [https://aptos.dev/cli-tool/aptos-cli-tool-overview](https://aptos.dev/cli-tool/aptos-cli-tool-overview)

### 1.4 Petra Wallet (Browser Extension)

Petra is a browser extension wallet for the Aptos blockchain, crucial for the frontend to connect to your Aptos account and sign transactions.

*   **How to Check**: Look for the Petra Wallet icon in your browser's extension bar.

*   **How to Install (if needed)**:
    1.  **For Chrome/Brave/Edge**: Chrome Web Store: [https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekbmbikiqnaoljfd](https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekbmbikiqnaoljfd)
    2.  **For Firefox**: Firefox Add-ons: [https://addons.mozilla.org/en-US/firefox/addon/petra-aptos-wallet/](https://addons.mozilla.org/en-US/firefox/addon/petra-aptos-wallet/)
    3.  After installation, create a new wallet or import an existing one. **Crucially, switch your network to `Testnet` within the Petra Wallet settings.**

### 1.5 Git

Git is a version control system used to clone the project repository.

*   **How to Check**: Open your terminal and run:
    ```bash
    git --version
    ```
    You should see the Git version.

*   **How to Install (if needed)**:
    *   **Windows**: [https://git-scm.com/download/win](https://git-scm.com/download/win)
    *   **macOS**: Run `xcode-select --install` in terminal, or download from [https://git-scm.com/download/mac](https://git-scm.com/download/mac)
    *   **Linux (Debian/Ubuntu)**: `sudo apt update && sudo apt install git`

## 2. Project Setup and Local Deployment

Once all prerequisites are met, follow these steps to get EventPass running on your local machine.

### 2.1 Clone the Repository

```bash
git clone <repository-url> # Replace with your project's Git URL
cd eventpass
```

### 2.2 Move Smart Contract Setup (Local Compilation & Deployment to Testnet)

Even for local development, your smart contract needs to be deployed to the Aptos Testnet so your frontend can interact with a real blockchain.

1.  **Initialize Aptos CLI Account**: If you haven't already, create an Aptos account and fund it with testnet tokens. This will give you your unique Aptos account address.
    ```bash
    aptos init --network testnet
    ```
    *Follow the prompts and **save your generated account address** (e.g., `0x1234...`).*

2.  **Fund Your Account**: Visit the Aptos Testnet Faucet ([https://aptoslabs.com/testnet-faucet](https://aptoslabs.com/testnet-faucet)), enter your account address, and request testnet APT tokens.

3.  **Update `move/Move.toml`**: This file tells the Move compiler where your module will be published.
    *   **File Path**: `eventpass/move/Move.toml`
    *   **Find this line**: `eventpass_ticket = "0x42"`
    *   **Replace with**: Your actual Aptos account address (the one you got in step 1).
    *   **Example**: If your address is `0x12345...`, the line should become `eventpass_ticket = "0x12345..."`

4.  **Deploy the Move Contract to Testnet**:
    ```bash
    cd move
    aptos move compile --named-addresses eventpass_ticket=YOUR_ACCOUNT_ADDRESS
    aptos move publish --named-addresses eventpass_ticket=YOUR_ACCOUNT_ADDRESS
    ```
    *Replace `YOUR_ACCOUNT_ADDRESS` with your actual address. This will deploy your contract to the Aptos Testnet. The address of the deployed contract will be the same as your account address.*

### 2.3 Backend API Setup

1.  **Install Dependencies**:
    ```bash
    cd ../backend # Navigate from 'move' back to 'eventpass', then into 'backend'
    npm install
    ```

2.  **Create `.env` File**: This file holds your local environment variables. It's crucial for the backend to know where to find the database and the smart contract.
    *   **File Path**: `eventpass/backend/.env`
    *   **Content**: Copy the content from `eventpass/backend/.env.example` and paste it into `eventpass/backend/.env`. Then, make the following replacements:
        ```dotenv
        # For local development, use SQLite
        DATABASE_URL="file:./dev.db"

        # Replace with your deployed Move contract address from Step 2.3.4
        CONTRACT_ADDRESS="YOUR_DEPLOYED_CONTRACT_ADDRESS"

        # Aptos Testnet URL (already set correctly)
        APTOS_NODE="https://fullnode.testnet.aptoslabs.com"

        # Local server port
        PORT=3000
        NODE_ENV=development
        ```
        *Replace `YOUR_DEPLOYED_CONTRACT_ADDRESS` with the Aptos account address you used to deploy the Move contract.*

3.  **Initialize Database and Run Migrations**:
    ```bash
    npx prisma generate # Generates the Prisma client based on your schema
    npx prisma migrate dev --name init # Creates the local SQLite database (dev.db) and applies migrations
    ```

4.  **Start the Backend Server**: Keep this terminal window open and running.
    ```bash
    npm run dev
    ```
    The backend API will be available at `http://localhost:3000`.

### 2.4 Frontend Website Setup

1.  **Install Dependencies**: Open a **new terminal window** and navigate to the frontend directory.
    ```bash
    cd ../frontend/eventpass-frontend # Navigate from 'backend' back to 'eventpass', then into 'frontend/eventpass-frontend'
pnpm install
    ```

2.  **Create `.env` File**: This file holds your frontend environment variables.
    *   **File Path**: `eventpass/frontend/eventpass-frontend/.env`
    *   **Content**: Copy the content from `eventpass/frontend/eventpass-frontend/.env.example` and paste it into `eventpass/frontend/eventpass-frontend/.env`. Then, make the following replacements:
        ```dotenv
        # Points to your local backend API
        VITE_BACKEND_URL=http://localhost:3000

        # Replace with your deployed Move contract address from Step 2.3.4
        VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS

        # Aptos Testnet URL (already set correctly)
        VITE_APTOS_NODE=https://fullnode.testnet.aptoslabs.com
        ```
        *Replace `YOUR_DEPLOYED_CONTRACT_ADDRESS` with the Aptos account address you used to deploy the Move contract.*

3.  **Start the Frontend Development Server**: Keep this terminal window open and running.
    ```bash
    pnpm run dev --host
    ```
    The frontend application will be available at `http://localhost:5173`.

## 3. Development Workflow (Running Both Locally)

To use the EventPass dApp locally, you will typically have two terminal windows open:

*   **Terminal 1**: Running the backend API server (`npm run dev` in `eventpass/backend/`)
*   **Terminal 2**: Running the frontend development server (`pnpm run dev --host` in `eventpass/frontend/eventpass-frontend/`)

Once both servers are running, open your web browser and navigate to `http://localhost:5173`. The frontend will automatically connect to your local backend and interact with the Aptos Testnet.

This setup includes hot-reloading for both frontend and backend components, meaning changes you make to the code will automatically reflect in your browser without manual restarts.

## 4. Verification (Local Testing)

1.  **Open Frontend**: Go to `http://localhost:5173` in your browser.
2.  **Connect Petra Wallet**: Click the 
