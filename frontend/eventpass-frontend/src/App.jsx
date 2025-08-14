import React, { useState, useEffect } from 'react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import QRCode from 'qrcode.react';
import axios from 'axios';
import './App.css';

// Initialize Aptos client
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [eventName, setEventName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ticketData, setTicketData] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x42';

  // Check if Petra wallet is available
  const isPetraAvailable = () => {
    return typeof window !== 'undefined' && window.aptos;
  };

  // Connect to Petra wallet
  const connectWallet = async () => {
    if (!isPetraAvailable()) {
      setMessage('Petra wallet is not installed. Please install Petra wallet extension.');
      return;
    }

    try {
      setLoading(true);
      const response = await window.aptos.connect();
      setWalletAddress(response.address);
      setIsConnected(true);
      setMessage('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setMessage('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await window.aptos.disconnect();
      setWalletAddress('');
      setIsConnected(false);
      setMessage('Wallet disconnected.');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Register for event
  const registerForEvent = async () => {
    if (!eventName.trim()) {
      setMessage('Please enter an event name.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/register`, {
        walletAddress,
        eventName: eventName.trim(),
      });
      
      setMessage('Registration successful! You can now mint your NFT ticket.');
      fetchRegistrations();
      setEventName('');
    } catch (error) {
      console.error('Error registering:', error);
      if (error.response?.status === 409) {
        setMessage('You are already registered for this event.');
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Mint NFT ticket
  const mintTicket = async () => {
    if (!eventName.trim()) {
      setMessage('Please enter an event name to mint ticket.');
      return;
    }

    if (!isPetraAvailable()) {
      setMessage('Petra wallet is not available.');
      return;
    }

    try {
      setLoading(true);
      
      // Create transaction payload
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::EventPassTicket::mint_ticket`,
        arguments: [eventName.trim(), walletAddress],
        type_arguments: [],
      };

      // Submit transaction
      const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
      
      // Wait for transaction confirmation
      const txnResult = await aptos.waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });

      if (txnResult.success) {
        setMessage('NFT ticket minted successfully!');
        setTicketData({
          eventName: eventName.trim(),
          walletAddress,
          transactionHash: pendingTransaction.hash,
        });
      } else {
        setMessage('Transaction failed. Please try again.');
      }
    } catch (error) {
      console.error('Error minting ticket:', error);
      setMessage('Failed to mint ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all registrations
  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/registrations`);
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  // Load registrations on component mount
  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">EventPass</h1>
          <p className="text-lg text-gray-600">NFT Event Ticketing on Aptos Blockchain</p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Wallet Connection</h2>
          
          {!isConnected ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Connect your Petra wallet to get started</p>
              <button
                onClick={connectWallet}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Petra Wallet'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-green-600 mb-2">✅ Wallet Connected</p>
              <p className="text-sm text-gray-600 mb-4 break-all">{walletAddress}</p>
              <button
                onClick={disconnectWallet}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Event Registration & Minting */}
        {isConnected && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Event Registration & NFT Minting</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name (e.g., Web3 Conference 2024)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={registerForEvent}
                  disabled={loading || !eventName.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register for Event'}
                </button>
                
                <button
                  onClick={mintTicket}
                  disabled={loading || !eventName.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Minting...' : 'Mint NFT Ticket'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`rounded-lg p-4 mb-6 ${
            message.includes('success') || message.includes('✅') 
              ? 'bg-green-100 text-green-800' 
              : message.includes('failed') || message.includes('error')
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        {/* Ticket QR Code */}
        {ticketData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Your NFT Ticket</h2>
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-50 rounded-lg">
                <QRCode
                  value={JSON.stringify({
                    event: ticketData.eventName,
                    wallet: ticketData.walletAddress,
                    txHash: ticketData.transactionHash,
                    timestamp: new Date().toISOString(),
                  })}
                  size={200}
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Event:</strong> {ticketData.eventName}</p>
                <p><strong>Wallet:</strong> {ticketData.walletAddress}</p>
                <p><strong>Transaction:</strong> {ticketData.transactionHash}</p>
              </div>
            </div>
          </div>
        )}

        {/* Registrations List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">All Registrations</h2>
          
          {registrations.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No registrations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Event Name</th>
                    <th className="text-left py-2">Wallet Address</th>
                    <th className="text-left py-2">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-b">
                      <td className="py-2">{reg.eventName}</td>
                      <td className="py-2 font-mono text-xs">{reg.walletAddress}</td>
                      <td className="py-2">{new Date(reg.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>EventPass - Powered by Aptos Blockchain</p>
        </div>
      </div>
    </div>
  );
}

export default App;

