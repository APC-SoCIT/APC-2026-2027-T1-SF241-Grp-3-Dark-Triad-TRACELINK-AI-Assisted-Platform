const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "firstName, lastName, email, and password are required" });
  }

  const existing = await prisma.uSER.findUnique({ where: { USR_Email: email } });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.uSER.create({
    data: {
      USR_FirstName: firstName,
      USR_LastName: lastName,
      USR_Email: email,
      USR_PasswordHash: passwordHash,
      USR_Role: "SEO_SPECIALIST",
      USR_Status: "ACTIVE",
    },
  });

  return res.status(201).json({
    id: user.USR_ID,
    firstName: user.USR_FirstName,
    lastName: user.USR_LastName,
    email: user.USR_Email,
    role: user.USR_Role,
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = await prisma.uSER.findUnique({ where: { USR_Email: email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (user.USR_Status === "DISABLED") {
    return res.status(403).json({ error: "This account has been disabled" });
  }

  const passwordMatches = await bcrypt.compare(password, user.USR_PasswordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.USR_ID, email: user.USR_Email, role: user.USR_Role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({
    token,
    user: {
      id: user.USR_ID,
      firstName: user.USR_FirstName,
      lastName: user.USR_LastName,
      email: user.USR_Email,
      role: user.USR_Role,
    },
  });
});

module.exports = router;