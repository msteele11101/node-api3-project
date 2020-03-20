const express = require("express");
const posts = require("./postDb");
const router = express.Router();

router.get("/", (req, res) => {
  posts
    .get()
    .then(posts => {
      res.status(201).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not get posts" });
    });
});

router.get("/:id", validatePostId,async(req, res, next) => {
  try {
    res.status(200).json(req.post);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  posts
    .remove(id)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not delete post" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const response = req.body;
  posts
    .update(id, response)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not update post" });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;

  posts.getById(id).then(post => {
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(400).json({ message: "No post found" });
    }
  });
}

module.exports = router;
