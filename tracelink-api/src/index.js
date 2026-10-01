require("dotenv").config();
const express = require("express");
const cors = require("cors");
const batchRoutes = require("./routes/batches");
const scanRoutes = require("./routes/scan");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", batchRoutes)
app.use("/api", scanRoutes);

app.get("/health", (req, res) => res.json({ status: "ok"}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`TraceLink API listening on port ${PORT}`);
});