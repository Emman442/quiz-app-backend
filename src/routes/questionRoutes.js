const {Router} = require("express")
const { fetchQuestion, uploadQuestions, createQuestion } = require("../controllers/QuestionController")
const router=Router()


router.get("/", fetchQuestion)
router.post("/insert-many", uploadQuestions)
router.post("/insert-one", createQuestion)

module.exports = router