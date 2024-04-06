const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/socialmedia");

// Define the schema for the User model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ], // Assuming 'Post' is another model
  dp: { type: String }, // URL to the display picture
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
});

// Compile model from schema
module.exports = mongoose.model("User123", UserSchema);
