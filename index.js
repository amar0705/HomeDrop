const express = require("express");
const bodyParser = require("body-parser");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/user.route");
const app = express();
require("dotenv").config();

app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.use("/", userRouter);

// app.listen(process.env.port, async () => {
//   try {
//     await connection;
//     console.log("Connected to the Database");
//   } catch (err) {
//     console.log("Something went wrong");
//   }
//   console.log(`Connected to the port ${process.env.port}`);
// });

module.exports = { app };
