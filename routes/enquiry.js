const express = require("express")
const router = express.Router()
const enquiryController = require("../controllers/enquiryController")

router.post('/',enquiryController.saveEnquiry);
module.exports = router 