import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Rent", "Sale"],
      required: true,
    },
    contact: {
      type: String,
      default: "",
    },
    utilities: {
      type: [String],
      enum: [
        "Furnished",
        "Unfurnished",
        "Parking Available",
        "Pet Friendly",
        "WiFi Included",
        "Heating Included",
        "Water Included",
      ],
      default: [],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    image: {
      type: String
    },
  },
  { timestamps: true }
);

postSchema.index({ location: "2dsphere" });

const Post = mongoose.model("Post", postSchema);
export default Post;
