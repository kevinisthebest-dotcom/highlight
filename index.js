const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const ADMIN_ID = 1409409437;
const DATA_FILE = "./data.json";

let data = {
  tagged: [],
  kickQueue: [],
  lagQueue: {}
};

// Load saved data
if (fs.existsSync(DATA_FILE)) {
  data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Save helper
function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
}

// 🔁 PERMANENT TAGGING
app.post("/ping", (req, res) => {
  const id = Number(req.body.userId);
  if (!data.tagged.includes(id)) {
    data.tagged.push(id);
    save();
  }
  res.sendStatus(200);
});

// 📋 GET ALL TAGGED USERS
app.get("/tagged", (req, res) => {
  res.json(data.tagged);
});

// 👢 ADMIN: QUEUE KICK
app.post("/admin/kick", (req, res) => {
  const { adminId, targetId } = req.body;

  if (Number(adminId) !== ADMIN_ID) {
    return res.status(403).send("Forbidden");
  }

  if (!data.kickQueue.includes(targetId)) {
    data.kickQueue.push(targetId);
    save();
  }

  res.sendStatus(200);
});

// ❓ CLIENT: CHECK IF I SHOULD BE KICKED
app.get("/check-kick/:id", (req, res) => {
  const id = Number(req.params.id);

  if (data.kickQueue.includes(id)) {
    data.kickQueue = data.kickQueue.filter(x => x !== id);
    save();
    return res.json({ kick: true });
  }

  res.json({ kick: false });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on", PORT));
