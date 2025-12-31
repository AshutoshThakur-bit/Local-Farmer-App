const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../config/multer");

const {createProduct, getAllProducts} = require("../controllers/productController");

router.post("/create", auth, upload.single("image"), createProduct);
router.get("/", getAllProducts);

module.exports = router;