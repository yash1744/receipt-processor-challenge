import express from "express";
import { v4 as uuidv4 } from "uuid";
import receiptSchema from "./schema.js"
import calculatePoints from "./utils.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const receipts = {};

// POST /receipts/process
app.post("/receipts/process", (req, res) => {
  const receipt = req.body;
  const { error} = receiptSchema.validate(receipt);
  if (error) {

    return res.status(400).json({ error: "Invalid receipt format" });
  } 
  const id = uuidv4();
  receipts[id] = { ...receipt, points: calculatePoints(receipt) };

  res.status(200).json({ id });
});


// GET /receipts/:id/points
app.get("/receipts/:id/points", (req, res) => {
  const { id } = req.params;

  if (!receipts[id]) {
    return res.status(404).json({ error: "No receipt found for that id" });
  }

  res.status(200).json({ points: receipts[id].points });
});

const server = app.listen(PORT, () => {
  console.log(`Receipt Processor API is running on http://localhost:${PORT}`);
});

export default server;
