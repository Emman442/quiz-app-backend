const { Router } = require("express");
const {
  uploadQuestions,
  fetchQuestion,
} = require("./src/controllers/QuestionController");
const router = Router();

router.get("/", fetchQuestion);
router.post("/insert-bulk", uploadQuestions);

module.exports = router;
