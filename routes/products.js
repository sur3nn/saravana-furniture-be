const express = require("express")
const router = express.Router()
const productController = require("../controllers/productControllers")

router.get('/',productController.getAllproducts)
router.post('/',productController.addProduct)
module.exports = router