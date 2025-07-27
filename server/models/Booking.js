const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    proId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    hour: { type: String, required: true },
    clientEmail: { type: String },
    paid: { type: Boolean, default: false }, // paid flag for successful payments
  },
  {
    timestamps: true, // keep this for createdAt/updatedAt might be used in payments.
  },
);

module.exports = mongoose.model("Booking", bookingSchema);
