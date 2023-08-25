const express = require("express");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserModel } = require("../models/user.model");
const { SentHistory } = require("../models/history.model");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { phone, email } = req.body;
  try {
    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Already exists" });
    }
    const newUser = new UserModel({ phone, email });
    await newUser.save();
    res.status(201).json({ message: "Registered Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

userRouter.post("/auth", async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await UserModel.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: "User Not found" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.key);
    res.json({ phone, token });
  } catch (err) {
    res.status(500).json({ message: "Soemthing went wrong", error: err.message });
  }
});

userRouter.post("/send-report", async (req, res) => {
  const authToken = req.headers.authorization;
  try {
    const decodedToken = jwt.verify(authToken, process.env.key);
    const userId = decodedToken.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorised" });
    }
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);

      const transporter = nodemailer.createTransport({
        service: "Outlook365",
        host: "smtp.office365.com",
        port: 587,
        auth: {
          user: process.env.user_name,
          pass: process.env.user_pass,
        },
      });

      const mailOptions = {
        from: process.env.user_name,
        to: user.email,
        subject: "Generated Report",
        text: "Please find the attached generated report",
        attachments: [
          {
            filename: "report.pdf",
            content: pdfData,
            contentType: "application/pdf",
          },
        ],
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.error("Error sending data:", error);
          res.status(500).json({ message: "Error sending mail" });
        } else {
          console.log("Email sent:", info.response);
          const sentHistory = new SentHistory({
            userId: user._id,
            created_at: new Date(),
            sent_to: user.email,
          });
          await sentHistory.save();
          res.json({ message: "Report sent successfully via email" });
        }
      });
    });

    doc.fontSize(20).text(`Report generated on: ${new Date()} & User Phone Number: ${user.phone}`);
    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

userRouter.get("/get-history", async (req, res) => {
  const authToken = req.headers.authorization;
  try {
    const decodedToken = jwt.verify(authToken, process.env.key);
    const userId = decodedToken.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorised" });
    }
    const sentHistory = await SentHistory.find({ userId });
    const formattedHistory = sentHistory.map((item) => {
      return {
        date_created: item.created_at,
        sent_to: "email",
      };
    });
    res.json(formattedHistory);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = { userRouter };
