var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const upload = require("./multer");
const localStratergy = require("passport-local");
passport.use(new localStratergy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/login", function (req, res, next) {
  //console.log(req.flash("error"));
  res.render("login", { error: req.flash("error") });
});
router.get("/feed", function (req, res, next) {
  res.render("feed");
});

router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res) {
    if (!req.file) {
      return res.status(400).send("no files were uploaded");
    }

    //res.send("file uploaded");

    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      image: req.file.filename,
      imageText: req.body.filecaption,
      userid: user._id,
    });

    user.posts.push(post._id);
    await user.save();
    res.send("done");
  }
);

router.get("/profile", isLoggedIn, async function (req, res) {
  //protected route

  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  console.log(user);
  res.render("profile", { user });
});

router.post("/register", function (req, res) {
  const { username, email, fullName } = req.body;
  const userData = new userModel({ username, email, fullName });

  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",

    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // agar app logged in ho toh aage padho
    return next();
  }
  res.redirect("/login"); // varna first route pr jao
}

/*
// here we are creating user and posts , and linking thier ids with each other
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

*/

module.exports = router;
