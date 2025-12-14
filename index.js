const express = require("express");
const app = express();

app.use(express.json());

let online = {};
const TIMEOUT = 30000;

// health check (IMPORTANT)
app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/ping", (req, res) => {
  const { userId } = req.body || {};
  if (userId) {
    online[userId] = Date.now();
  }
  res.send("ok");
});

app.get("/online", (req, res) => {
  const now = Date.now();
  for (const id in online) {
    if (now - online[id] > TIMEOUT) {
      delete online[id];
    }
  }
  res.json(Object.keys(online).map(Number));
});

// 🔑 THIS LINE IS CRITICAL
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
