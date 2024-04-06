var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/createUser", async function (req, res) {
  let createdUser = await userModel.create({
    username: "rohit",
    password: "rohit",
    posts: [],
    email: "rohit@gmail.com",
    fullName: "rohit jain",
  });
  console.log(createdUser);
  res.send(createdUser);
});

router.get("/createpost", async function (req, res) {
  let createdPost = await postModel.create({
    postText: "Hello kaise ho saare",
    user: "66109d019fb5cd9951637480",
  });
  let user = await userModel.findOne({ _id: "66109d019fb5cd9951637480" });
  user.posts.push(createdPost._id); // Posts arary mein save kro
  await user.save();

  res.send("done");
});

router.get("/alluserposts", async function (req, res) {
  let user = await userModel
    .findOne({
      _id: "66109d019fb5cd9951637480",
    }).populate('posts');
  res.send(user);
});
module.exports = router;
