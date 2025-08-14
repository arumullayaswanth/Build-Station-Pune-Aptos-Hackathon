# EventPass Deployment Instructions

This document provides step-by-step instructions for deploying the EventPass NFT Event Ticketing dApp to production environments.

## Prerequisites

Before beginning deployment, ensure you have:

- Aptos CLI installed and configured
- Node.js 18+ installed
- Git repository access
- Accounts on deployment platforms (Render, Vercel, etc.)
- Petra wallet with testnet APT tokens

## 1. Move Smart Contract Deployment

### Step 1: Setup Aptos CLI

```bash
# Install Aptos CLI (if not already installed)
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# Verify installation
aptos --version
```

### Step 2: Create and Fund Aptos Account

```bash
# Initialize new account
aptos init --network testnet

# Follow prompts to generate or import private key
# Save the generated account address

# Fund account with testnet tokens
# Visit: https://aptoslabs.com/testnet-faucet
# Enter your account address and request tokens
```

### Step 3: Deploy Smart Contract

```bash
cd move

# Update Move.toml with your account address
# Replace 0x42 with your actual address

# Compile contract
aptos move compile --named-addresses eventpass_ticket=YOUR_ACCOUNT_ADDRESS

# Deploy to testnet
aptos move publish --named-addresses eventpass_ticket=YOUR_ACCOUNT_ADDRESS

# Save the deployment transaction hash for verification
```

### Step 4: Verify Deployment

```bash
# Check deployed modules
aptos account list --account YOUR_ACCOUNT_ADDRESS

# Verify on Aptos Explorer
# Visit: https://explorer.aptoslabs.com/account/YOUR_ACCOUNT_ADDRESS?network=testnet
```

## 2. Backend API Deployment (Render)

### Step 1: Prepare Repository

```bash
# Ensure package.json has correct scripts
cd backend

# Verify package.json contains:
{
  "scripts": {
    "start": "node index.js",
    "build": "npx prisma generate && npx prisma migrate deploy"
  }
}
```

### Step 2: Create Render Service

1. Visit https://render.com and sign up/login
2. Connect your GitHub repository
3. Create new "Web Service"
4. Configure service:
   - **Name**: eventpass-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

### Step 3: Configure Environment Variables

In Render dashboard, add environment variables:

```
DATABASE_URL=file:./prod.db
CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
APTOS_NODE=https://fullnode.testnet.aptoslabs.com
NODE_ENV=production
PORT=10000
```

### Step 4: Deploy and Test

```bash
# After deployment, test the API
curl https://your-app-name.onrender.com/registrations

# Should return empty array: []
```

## 3. Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Prepare Frontend

```bash
cd frontend/eventpass-frontend

# Update .env with production backend URL
VITE_BACKEND_URL=https://your-backend-url.onrender.com
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_APTOS_NODE=https://fullnode.testnet.aptoslabs.com

# Test build locally
pnpm run build
```

### Step 3: Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: eventpass-frontend
# - Directory: ./
# - Override settings? No
```

### Step 4: Configure Production Environment

In Vercel dashboard:

1. Go to Project Settings > Environment Variables
2. Add production environment variables:

```
VITE_BACKEND_URL=https://your-backend-url.onrender.com
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_APTOS_NODE=https://fullnode.testnet.aptoslabs.com
```

3. Redeploy with production settings:

```bash
vercel --prod
```

## 4. Database Setup for Production

### SQLite (Simple Deployment)

For small-scale deployments, SQLite works well:

```bash
# In backend directory
npx prisma migrate deploy
npx prisma generate
```

### PostgreSQL (Scalable Production)

For production scale, use PostgreSQL:

1. **Update schema.prisma**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Get PostgreSQL database**:
   - Use Render PostgreSQL add-on
   - Or external service like Supabase, PlanetScale

3. **Update environment variables**:
```
DATABASE_URL="postgresql://username:password@host:port/database"
```

4. **Run migrations**:
```bash
npx prisma migrate deploy
npx prisma generate
```

## 5. Complete Deployment Verification

### Test Smart Contract

```bash
# Use Aptos CLI to test contract
aptos move run \
  --function-id YOUR_ACCOUNT_ADDRESS::EventPassTicket::mint_ticket \
  --args string:"Test Event" address:YOUR_ACCOUNT_ADDRESS
```

### Test Backend API

```bash
# Test registration endpoint
curl -X POST https://your-backend-url.onrender.com/register \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "eventName": "Test Event"
  }'

# Test get registrations
curl https://your-backend-url.onrender.com/registrations
```

### Test Frontend

1. Visit your deployed frontend URL
2. Connect Petra wallet
3. Register for a test event
4. Mint an NFT ticket
5. Verify QR code generation

## 6. Alternative Deployment Options

### Backend Alternatives

#### Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

#### Heroku
```bash
# Install Heroku CLI
# Create Procfile in backend directory:
echo "web: node index.js" > Procfile

heroku create eventpass-backend
git push heroku main
```

### Frontend Alternatives

#### Netlify
```bash
# Build project
pnpm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# Install gh-pages
npm install -g gh-pages

# Deploy
gh-pages -d dist
```

## 7. Post-Deployment Checklist

- [ ] Smart contract deployed and verified on Aptos Explorer
- [ ] Backend API responding to health checks
- [ ] Frontend loading without errors
- [ ] Wallet connection working
- [ ] Event registration functional
- [ ] NFT minting operational
- [ ] QR code generation working
- [ ] Database storing registrations
- [ ] CORS properly configured
- [ ] Environment variables secure
- [ ] SSL certificates active
- [ ] Domain names configured (if applicable)

## 8. Monitoring and Maintenance

### Backend Monitoring

```bash
# Check backend logs in Render dashboard
# Monitor API response times
# Set up uptime monitoring (UptimeRobot, etc.)
```

### Frontend Monitoring

```bash
# Monitor Vercel deployment logs
# Check Core Web Vitals in Vercel dashboard
# Set up error tracking (Sentry, etc.)
```

### Smart Contract Monitoring

```bash
# Monitor contract events on Aptos Explorer
# Track transaction success rates
# Monitor gas usage patterns
```

## 9. Troubleshooting Common Issues

### Contract Deployment Fails
```bash
# Check account balance
aptos account list --account YOUR_ACCOUNT_ADDRESS

# Verify network configuration
aptos config show-profiles

# Check for compilation errors
aptos move compile --named-addresses eventpass_ticket=YOUR_ACCOUNT_ADDRESS
```

### Backend Deployment Issues
```bash
# Check build logs in Render dashboard
# Verify environment variables
# Test database connection
```

### Frontend Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build

# Check environment variable format
# Ensure all VITE_ prefixes are correct
```

### CORS Issues
```bash
# Update backend CORS configuration
# Add frontend domain to allowed origins
# Check preflight request handling
```

## 10. Security Considerations

### Environment Variables
- Never commit .env files to version control
- Use platform-specific secret management
- Rotate sensitive keys regularly

### Smart Contract Security
- Audit contract code before mainnet deployment
- Test thoroughly on testnet
- Implement proper access controls

### API Security
- Implement rate limiting
- Add input validation
- Use HTTPS only
- Monitor for suspicious activity

This completes the comprehensive deployment guide for EventPass. Follow these steps carefully and test each component thoroughly before proceeding to the next step.

