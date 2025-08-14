# EventPass – NFT Event Ticketing dApp

EventPass is a complete end-to-end full-stack Web3 project that implements an NFT-based event ticketing system on the Aptos blockchain. This decentralized application (dApp) allows users to register for events and mint NFT tickets that serve as proof of attendance and ownership.

## Project Overview

EventPass revolutionizes event ticketing by leveraging blockchain technology to create tamper-proof, transferable, and verifiable digital tickets. Each ticket is minted as a unique NFT on the Aptos blockchain, ensuring authenticity and preventing fraud while providing event organizers with a modern, secure ticketing solution.

The project demonstrates the integration of multiple cutting-edge technologies including Move smart contracts, Node.js backend APIs, React frontend applications, and Aptos blockchain infrastructure. It serves as both a functional ticketing system and an educational resource for developers interested in Web3 development on Aptos.

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Blockchain** | Aptos Testnet | Smart contract deployment and NFT minting |
| **Smart Contract** | Move Language | NFT ticket creation and collection management |
| **Backend API** | Node.js + Express | Registration management and data persistence |
| **Database** | Prisma ORM + SQLite | Local development and registration storage |
| **Frontend** | React.js + Vite | User interface and wallet integration |
| **Styling** | Tailwind CSS | Responsive design and modern UI components |
| **Wallet Integration** | Petra Wallet | Aptos blockchain interaction |
| **QR Code Generation** | qrcode.react | Ticket verification and display |
| **HTTP Client** | Axios | API communication between frontend and backend |

## Features

### Core Functionality
- **Wallet Connection**: Seamless integration with Petra wallet for Aptos blockchain interaction
- **Event Registration**: Backend API for storing user registrations with wallet addresses
- **NFT Minting**: On-chain ticket creation using Move smart contracts
- **QR Code Generation**: Visual ticket representation for easy verification
- **Registration Management**: Complete CRUD operations for event registrations

### Technical Features
- **Cross-Origin Resource Sharing (CORS)**: Enabled for frontend-backend communication
- **Environment Configuration**: Flexible deployment settings via environment variables
- **Error Handling**: Comprehensive error management across all application layers
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Transaction Monitoring**: Real-time blockchain transaction status tracking

## Project Structure

```
eventpass/
├── move/                          # Move smart contract
│   ├── sources/
│   │   └── eventpass_ticket.move  # Main contract implementation
│   └── Move.toml                  # Move package configuration
├── backend/                       # Node.js backend API
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema definition
│   │   └── migrations/            # Database migration files
│   ├── index.js                   # Express server implementation
│   ├── package.json               # Node.js dependencies and scripts
│   └── .env                       # Environment variables
├── frontend/                      # React frontend application
│   └── eventpass-frontend/
│       ├── src/
│       │   ├── App.jsx            # Main application component
│       │   ├── App.css            # Application styles
│       │   └── main.jsx           # Application entry point
│       ├── index.html             # HTML template
│       ├── package.json           # React dependencies and scripts
│       └── .env                   # Frontend environment variables
└── README.md                      # Project documentation
```



## Setup & Installation

### Prerequisites

Before setting up EventPass, ensure you have the following tools installed on your development machine:

- **Node.js** (version 18.0 or higher) - Required for running the backend API and frontend development server
- **npm or pnpm** - Package manager for installing JavaScript dependencies
- **Aptos CLI** - Command-line tool for deploying Move smart contracts to the Aptos blockchain
- **Petra Wallet** - Browser extension for interacting with the Aptos blockchain
- **Git** - Version control system for cloning and managing the project repository

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd eventpass
```

#### 2. Backend Setup

Navigate to the backend directory and install the required dependencies:

```bash
cd backend
npm install
```

Create the environment configuration file:

```bash
# Create .env file with the following content:
DATABASE_URL="file:./dev.db"
CONTRACT_ADDRESS="0x42"
APTOS_NODE="https://fullnode.testnet.aptoslabs.com"
```

Initialize the database and run migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start the backend server
npm run dev
```

The backend API will be available at `http://localhost:3000` with the following endpoints:
- `POST /register` - Register a user for an event
- `GET /registrations` - Retrieve all event registrations

#### 3. Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend/eventpass-frontend
pnpm install
```

Create the frontend environment configuration:

```bash
# Create .env file with the following content:
VITE_BACKEND_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=0x42
VITE_APTOS_NODE=https://fullnode.testnet.aptoslabs.com
```

Start the development server:

```bash
pnpm run dev --host
```

The frontend application will be available at `http://localhost:5173` and will automatically reload when you make changes to the source code.

#### 4. Move Smart Contract Setup

The Move smart contract is located in the `move/` directory and contains the core NFT ticketing logic. The contract defines a module called `EventPassTicket` that handles collection creation and ticket minting operations.

To compile the Move contract locally (optional for development):

```bash
cd move
aptos move compile
```

### Development Workflow

For local development, you'll typically run both the backend and frontend simultaneously:

1. **Terminal 1**: Start the backend API server
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2**: Start the frontend development server
   ```bash
   cd frontend/eventpass-frontend
   pnpm run dev --host
   ```

3. **Browser**: Open `http://localhost:5173` to access the application

The development setup includes hot reloading for both frontend and backend components, allowing you to see changes immediately without manual restarts.


## Deployment Guide

### Move Smart Contract Deployment

#### Prerequisites for Contract Deployment

Before deploying the Move smart contract to Aptos testnet, ensure you have:

1. **Aptos CLI installed** - Download from the official Aptos documentation
2. **Aptos account with testnet tokens** - Create an account and fund it with testnet APT
3. **Private key access** - Either through Aptos CLI account creation or Petra wallet export

#### Step-by-Step Contract Deployment

**Step 1: Initialize Aptos CLI Account**

```bash
# Initialize a new Aptos account (if you don't have one)
aptos init

# Follow the prompts to:
# - Choose network: testnet
# - Enter your private key or generate a new one
# - Confirm the account address
```

**Step 2: Fund Your Account**

Visit the Aptos Testnet Faucet and request testnet tokens:
- URL: `https://aptoslabs.com/testnet-faucet`
- Enter your account address
- Request testnet APT tokens (required for gas fees)

**Step 3: Update Contract Address**

Before deployment, update the contract address in `Move.toml`:

```toml
[addresses]
eventpass_ticket = "YOUR_ACCOUNT_ADDRESS_HERE"
```

Replace `0x42` with your actual Aptos account address obtained from Step 1.

**Step 4: Compile and Deploy**

```bash
cd move

# Compile the Move contract
aptos move compile

# Deploy to Aptos testnet
aptos move publish --named-addresses eventpass_ticket=YOUR_ACCOUNT_ADDRESS_HERE

# Example with actual address:
# aptos move publish --named-addresses eventpass_ticket=0x1234567890abcdef1234567890abcdef12345678
```

**Step 5: Verify Deployment**

After successful deployment, you'll receive a transaction hash. You can verify the deployment using:

```bash
# Check account resources
aptos account list --account YOUR_ACCOUNT_ADDRESS_HERE

# View transaction details
aptos transaction show --transaction-hash DEPLOYMENT_TX_HASH
```

**Step 6: Update Application Configuration**

Update the contract address in both backend and frontend environment files:

Backend `.env`:
```
CONTRACT_ADDRESS="YOUR_DEPLOYED_CONTRACT_ADDRESS"
```

Frontend `.env`:
```
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

### Backend API Deployment

#### Deployment to Render

Render provides an excellent platform for deploying Node.js applications with automatic builds and deployments.

**Step 1: Prepare for Deployment**

Ensure your `package.json` includes the correct start script:

```json
{
  "scripts": {
    "start": "node index.js",
    "build": "npx prisma generate && npx prisma migrate deploy"
  }
}
```

**Step 2: Create Render Account and Service**

1. Visit `https://render.com` and create an account
2. Connect your GitHub repository containing the EventPass project
3. Create a new "Web Service" from your repository
4. Configure the service settings:
   - **Name**: `eventpass-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

**Step 3: Configure Environment Variables**

In the Render dashboard, add the following environment variables:

```
DATABASE_URL=file:./prod.db
CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
APTOS_NODE=https://fullnode.testnet.aptoslabs.com
NODE_ENV=production
```

**Step 4: Deploy and Monitor**

Render will automatically build and deploy your application. Monitor the deployment logs for any errors and ensure the service starts successfully.

#### Alternative: Railway Deployment

Railway offers another excellent option for backend deployment:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

Configure environment variables in the Railway dashboard similar to the Render setup.

### Frontend Deployment

#### Deployment to Vercel

Vercel provides optimal hosting for React applications with automatic builds and global CDN distribution.

**Step 1: Prepare Build Configuration**

Ensure your frontend builds correctly:

```bash
cd frontend/eventpass-frontend
pnpm run build
```

**Step 2: Install Vercel CLI**

```bash
npm install -g vercel
```

**Step 3: Deploy to Vercel**

```bash
# From the frontend directory
cd frontend/eventpass-frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your personal account
# - Link to existing project? No
# - Project name: eventpass-frontend
# - Directory: ./
# - Override settings? No
```

**Step 4: Configure Environment Variables**

In the Vercel dashboard, add environment variables:

```
VITE_BACKEND_URL=https://your-backend-url.onrender.com
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_APTOS_NODE=https://fullnode.testnet.aptoslabs.com
```

**Step 5: Redeploy with Environment Variables**

```bash
vercel --prod
```

#### Alternative: Netlify Deployment

For Netlify deployment:

```bash
# Build the project
pnpm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Database Migration for Production

When deploying to production, ensure proper database setup:

**For SQLite (Development/Small Scale)**:
```bash
# In your backend directory
npx prisma migrate deploy
npx prisma generate
```

**For PostgreSQL (Production Scale)**:

Update your `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Update environment variables with PostgreSQL connection string:
```
DATABASE_URL="postgresql://username:password@host:port/database"
```

### Post-Deployment Verification

After completing all deployments, verify the entire system:

1. **Smart Contract**: Verify contract deployment on Aptos Explorer
2. **Backend API**: Test endpoints using curl or Postman
3. **Frontend**: Access the deployed URL and test wallet connection
4. **Integration**: Complete an end-to-end test of event registration and NFT minting

**Example Verification Commands**:

```bash
# Test backend API
curl https://your-backend-url.onrender.com/registrations

# Test frontend accessibility
curl -I https://your-frontend-url.vercel.app
```


## Example Environment Files

### Backend Environment (.env)

Create a `.env` file in the `backend/` directory with the following configuration:

```bash
# Database Configuration
# For development (SQLite)
DATABASE_URL="file:./dev.db"

# For production (PostgreSQL example)
# DATABASE_URL="postgresql://username:password@localhost:5432/eventpass_db"

# Aptos Blockchain Configuration
CONTRACT_ADDRESS="0x1234567890abcdef1234567890abcdef12345678"
APTOS_NODE="https://fullnode.testnet.aptoslabs.com"

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: API Keys for external services
# CORS_ORIGIN="http://localhost:5173"
```

### Frontend Environment (.env)

Create a `.env` file in the `frontend/eventpass-frontend/` directory:

```bash
# Backend API Configuration
VITE_BACKEND_URL=http://localhost:3000

# For production deployment
# VITE_BACKEND_URL=https://your-backend-url.onrender.com

# Aptos Blockchain Configuration
VITE_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
VITE_APTOS_NODE=https://fullnode.testnet.aptoslabs.com

# Optional: Application Configuration
# VITE_APP_NAME="EventPass"
# VITE_APP_VERSION="1.0.0"
```

## Usage Instructions

### For End Users

#### Getting Started with EventPass

**Step 1: Install Petra Wallet**

1. Visit the Chrome Web Store or Firefox Add-ons
2. Search for "Petra Aptos Wallet"
3. Install the browser extension
4. Create a new wallet or import an existing one
5. Switch to Aptos Testnet in wallet settings

**Step 2: Fund Your Wallet**

1. Copy your wallet address from Petra
2. Visit the Aptos Testnet Faucet: `https://aptoslabs.com/testnet-faucet`
3. Paste your address and request testnet APT tokens
4. Wait for the transaction to confirm (usually 1-2 minutes)

**Step 3: Access EventPass**

1. Navigate to the deployed EventPass frontend URL
2. Click "Connect Petra Wallet"
3. Approve the connection in your Petra wallet
4. Your wallet address will be displayed once connected

**Step 4: Register for an Event**

1. Enter an event name in the registration form
2. Click "Register for Event"
3. Wait for the registration to be saved to the database
4. You'll see a success message upon completion

**Step 5: Mint Your NFT Ticket**

1. Enter the same event name used for registration
2. Click "Mint NFT Ticket"
3. Approve the transaction in your Petra wallet
4. Wait for the blockchain transaction to confirm
5. Your NFT ticket and QR code will be displayed

#### Understanding Your NFT Ticket

Once minted, your NFT ticket contains:
- **Event Name**: The specific event you registered for
- **Wallet Address**: Your unique Aptos wallet identifier
- **Transaction Hash**: Blockchain proof of ticket creation
- **QR Code**: Visual representation for easy verification
- **Timestamp**: When the ticket was generated

The QR code contains all ticket information in JSON format and can be scanned by event organizers for verification.

### For Developers

#### Smart Contract Interaction

The Move smart contract provides the following functionality:

**Collection Management**:
```move
// Creates "EventPass Tickets" collection if it doesn't exist
// Automatically called during first ticket mint
```

**Ticket Minting**:
```move
public entry fun mint_ticket(
    creator: &signer,
    event_name: String,
    recipient_address: address,
)
```

**Event Emission**:
```move
struct TicketMinted has drop, store {
    event_name: String,
    ticket_id: u64,
    recipient_address: address,
}
```

#### API Endpoints

**Registration Endpoint**:
```http
POST /register
Content-Type: application/json

{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "eventName": "Web3 Conference 2024"
}
```

**Response**:
```json
{
  "id": "uuid-string",
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "eventName": "Web3 Conference 2024",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Registrations List Endpoint**:
```http
GET /registrations
```

**Response**:
```json
[
  {
    "id": "uuid-string-1",
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "eventName": "Web3 Conference 2024",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "uuid-string-2",
    "walletAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
    "eventName": "Blockchain Summit 2024",
    "createdAt": "2024-01-15T11:45:00.000Z"
  }
]
```

#### Frontend Integration

**Wallet Connection**:
```javascript
// Check if Petra wallet is available
const isPetraAvailable = () => {
  return typeof window !== 'undefined' && window.aptos;
};

// Connect to wallet
const connectWallet = async () => {
  const response = await window.aptos.connect();
  setWalletAddress(response.address);
};
```

**Transaction Submission**:
```javascript
// Create transaction payload
const payload = {
  type: "entry_function_payload",
  function: `${CONTRACT_ADDRESS}::EventPassTicket::mint_ticket`,
  arguments: [eventName, walletAddress],
  type_arguments: [],
};

// Submit transaction
const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
```

#### Error Handling

Common error scenarios and their handling:

**Wallet Not Connected**:
```javascript
if (!isConnected) {
  setMessage('Please connect your Petra wallet first.');
  return;
}
```

**Duplicate Registration**:
```javascript
if (error.response?.status === 409) {
  setMessage('You are already registered for this event.');
}
```

**Transaction Failure**:
```javascript
if (!txnResult.success) {
  setMessage('Transaction failed. Please try again.');
}
```

### For Event Organizers

#### Setting Up Events

1. **Deploy Your Own Instance**: Follow the deployment guide to create your own EventPass instance
2. **Configure Event Details**: Modify the frontend to include specific event information
3. **Customize Branding**: Update colors, logos, and styling to match your event brand
4. **Set Registration Limits**: Implement additional logic for ticket quantity limits

#### Ticket Verification

Event organizers can verify tickets by:

1. **QR Code Scanning**: Use any QR code scanner to read ticket data
2. **Blockchain Verification**: Check transaction hashes on Aptos Explorer
3. **Database Cross-Reference**: Verify registrations against the backend database
4. **Wallet Verification**: Confirm ticket ownership through wallet signatures

#### Analytics and Reporting

The backend database stores comprehensive registration data that can be used for:

- **Attendance Tracking**: Monitor registration numbers over time
- **Wallet Analysis**: Understand your audience's blockchain engagement
- **Event Metrics**: Generate reports on ticket distribution and usage
- **Fraud Prevention**: Identify suspicious registration patterns

## Troubleshooting

### Common Issues and Solutions

**Issue: Petra Wallet Not Detected**
```
Solution: Ensure Petra wallet extension is installed and enabled in your browser.
Check that you're using a supported browser (Chrome, Firefox, Edge).
```

**Issue: Transaction Fails with Insufficient Funds**
```
Solution: Visit the Aptos testnet faucet to obtain more APT tokens.
Ensure you're connected to the correct network (Aptos Testnet).
```

**Issue: Backend API Connection Error**
```
Solution: Verify the backend server is running on the correct port.
Check CORS configuration if accessing from a different domain.
Confirm environment variables are properly set.
```

**Issue: Smart Contract Deployment Fails**
```
Solution: Verify your Aptos CLI is properly configured.
Ensure you have sufficient APT tokens for deployment gas fees.
Check that the contract address in Move.toml matches your account.
```

**Issue: Frontend Build Errors**
```
Solution: Clear node_modules and reinstall dependencies.
Verify all environment variables are properly prefixed with VITE_.
Check for any missing dependencies in package.json.
```

### Getting Help

For additional support and community assistance:

- **Aptos Documentation**: `https://aptos.dev/`
- **Aptos Discord**: Join the official Aptos developer community
- **GitHub Issues**: Report bugs and feature requests in the project repository
- **Stack Overflow**: Search for Aptos and Move-related questions

## Contributing

We welcome contributions to EventPass! Please follow these guidelines:

1. **Fork the Repository**: Create your own fork of the project
2. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
3. **Make Changes**: Implement your improvements or bug fixes
4. **Test Thoroughly**: Ensure all functionality works as expected
5. **Submit Pull Request**: Provide a clear description of your changes

### Development Standards

- **Code Style**: Follow existing code formatting and naming conventions
- **Documentation**: Update README and inline comments for new features
- **Testing**: Add appropriate tests for new functionality
- **Security**: Follow blockchain security best practices

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

EventPass was built using the following open-source technologies and resources:

- **Aptos Blockchain**: For providing a fast and secure blockchain platform
- **Move Language**: For smart contract development capabilities
- **React Ecosystem**: For modern frontend development tools
- **Node.js Community**: For robust backend development frameworks
- **Tailwind CSS**: For utility-first styling approach

Special thanks to the Aptos developer community for their comprehensive documentation and support resources.

