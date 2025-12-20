const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// LOGIN OR SIGNUP
exports.loginOrSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    let user = await User.findOne();

    if (!user) {
      // No user exists → first time login = signup
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword });

      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

      return res.status(201).json({ message: "User created", token });
    } else {
      // User exists → login
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      return res.status(200).json({ message: "Login successful", token });
    }
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
