const Order = require("../models/Order");

exports.placeOrder = async (req, res)=>{
    try{
        console.log("Order request received:", req.body);
        console.log("User info:", req.user);
        
        const {farmerId, products, totalAmount} = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({message: "No products in order"});
        }

        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({message: "Invalid total amount"});
        }

        const order = new Order({
            customerId: req.user.id,
            farmerId: farmerId || null,
            products,
            totalAmount
        });

        console.log("Order data before save:", order);
        await order.save();
        console.log("Order saved successfully:", order);
        
        res.status(201).json({message: "Order placed successfully", order});

    }catch(err){
        console.error("Order error:", err);
        return res.status(500).json({message: "Failed to place order", error: err.message});
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const customerId = req.user.id;

        const orders = await Order.find({customerId})
            .populate('customerId', 'name email')
            .populate('farmerId', 'name email')
            .sort({createdAt: -1});

        res.status(200).json(orders);

    } catch (err) {
        console.error("Get orders error:", err);
        return res.status(500).json({message: "Failed to fetch orders", error: err.message});
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const {orderId} = req.params;
        const customerId = req.user.id;

        // Find order and verify it belongs to the user
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        if (order.customerId.toString() !== customerId) {
            return res.status(403).json({message: "Unauthorized to cancel this order"});
        }

        // Check if order can be cancelled (only pending or confirmed orders)
        const cancellableStatuses = ["pending", "confirmed"];
        if (!cancellableStatuses.includes(order.status?.toLowerCase())) {
            return res.status(400).json({message: `Cannot cancel ${order.status} order`});
        }

        // Update order status to cancelled
        order.status = "cancelled";
        await order.save();

        res.status(200).json({message: "Order cancelled successfully", order});

    } catch (err) {
        console.error("Cancel order error:", err);
        return res.status(500).json({message: "Failed to cancel order", error: err.message});
    }
};