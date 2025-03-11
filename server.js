const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

const authRouter = require("./routes/authRoute");
const postRouter = require("./routes/postRoute");
const userRouter = require("./routes/userRoute");

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(MONGODB_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
