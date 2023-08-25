const mongoose = require("mongoose");

const sentHistorySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  sent_to: {
    type: String,
    required: true,
  },
});

const SentHistory = mongoose.model("SentHistory", sentHistorySchema);

module.exports = { SentHistory };
