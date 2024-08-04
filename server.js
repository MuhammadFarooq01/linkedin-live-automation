const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("LinkedIn Live Automation API");
});

// Create a channel
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  res.send("login endpoint");
});
app.post("/logout", (req, res) => {
  res.send("logout endpoint");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
