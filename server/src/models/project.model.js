import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    name: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    role: {
      type: String,
      enum: ["Admin", "Member"],
      default: "Member"
    }
  },
  { _id: true, timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    members: [memberSchema]
  },
  { timestamps: true }
);

projectSchema.index({ "members.user": 1 });
projectSchema.index({ "members.email": 1 });

export const Project = mongoose.model("Project", projectSchema);