const express = require("express");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// POST /register - saves registration (wallet address + event name) to DB.
app.post("/register", async (req, res) => {
  const { walletAddress, eventName } = req.body;

  if (!walletAddress || !eventName) {
    return res.status(400).json({ error: "Wallet address and event name are required." });
  }

  try {
    const registration = await prisma.registration.create({
      data: {
        walletAddress,
        eventName,
      },
    });
    res.status(201).json(registration);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Registration already exists for this wallet and event." });
    }
    console.error("Error saving registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET /registrations - lists all registrations.
app.get("/registrations", async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany();
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`);
});


