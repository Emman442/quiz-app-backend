const { signup, login, fetchAllUsers, protect, getMe } = require("../controllers/userController");
const router = require("express").Router()


router.post("/signup",signup)
router.post("/login",login)
router.get("/all-users",fetchAllUsers)
router.get("/me", protect,getMe)

module.exports = router;