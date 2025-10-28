import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      default: "general",
    },
    date: { type: Date, default: Date.now() },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
  },
  { timestamps: true }
);

noteSchema.index({ title: "text", description: "text" });

export default mongoose.model("Note", noteSchema);
