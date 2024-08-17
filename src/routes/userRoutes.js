const { signup, login, fetchAllUsers } = require("../controllers/userController");
const router = require("express").Router()


router.post("/signup",signup)
router.post("/login",login)
router.get("/all-users",fetchAllUsers)

module.exports = router;