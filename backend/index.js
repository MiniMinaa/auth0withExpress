// backend/index.js
import express from "express";
import { authMiddleware } from "./middleware/auth.js";
import pkg from "express-openid-connect";
import cors from "cors";
import "dotenv/config";

console.log("DEBUG SECRET:", process.env.SECRET);

const { requiresAuth } = pkg;
const app = express();
app.use(authMiddleware);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  return res.oidc.login({ returnTo: "http://localhost:5173/profile" });
});

app.get("/profile", requiresAuth(), (req, res) => {
  try {
    res.json(req.oidc.user);
  } catch (error) {
    console.log(error);
  }
});

// Public test route: return a hardcoded list of books
app.get("/books", (req, res) => {
  const books = [
    { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien" },
    { id: 2, title: "1984", author: "George Orwell" },
    { id: 3, title: "Clean Code", author: "Robert C. Martin" },
  ];
  res.json(books);
});

// Protected route
// app.get("/secure-data", verifyToken, (req, res) => {
//   res.json({
//     message: "This is protected data",
//     user: req.user, // Decoded token info
//   });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
