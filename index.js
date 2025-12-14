const express = require("express");
const app = express();

app.use(express.json());

let online = {}; // userId -> timestamp
const TIMEOUT = 15000; // 15 seconds

app.post("/ping", (req, res) => {
  const { userId } = req.body;
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

app.listen(process.env.PORT || 3000);
