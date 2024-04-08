const mongoose = require("mongoose");

// Define the schema for the Post model
const PostSchema = new mongoose.Schema({
  imageText: { type: String, required: true },
  //id associate kr rahe hai yaha

  image : {
    type : String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User123",
  },
  createdAt: { type: Date, default: Date.now() }, // Automatically set to the current date and time
  likes: { type: Array, default: [] }, // Default number of likes is 0
});

// Compile model from schema
module.exports = mongoose.model("Post", PostSchema);
