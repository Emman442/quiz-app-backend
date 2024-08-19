const { signup, login, fetchAllUsers, protect, getMe, updateScore } = require("../controllers/userController");
const router = require("express").Router()


router.post("/signup",signup)
router.post("/login",login)
router.get("/all-users",fetchAllUsers)
router.get("/me", protect,getMe)
router.put("/update-score", protect, updateScore)

module.exports = router;