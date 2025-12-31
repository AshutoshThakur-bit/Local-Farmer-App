const router = require("express").Router();
const auth = require("../middleware/auth");
const {placeOrder, getUserOrders, cancelOrder} = require("../controllers/orderController");

router.post("/place", auth, placeOrder);
router.get("/my-orders", auth, getUserOrders);
router.post("/cancel/:orderId", auth, cancelOrder);
 
module.exports = router;