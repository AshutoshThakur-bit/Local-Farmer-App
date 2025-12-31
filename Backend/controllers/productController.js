const Product = require("../models/Product");
const path = require("path");

exports.createProduct = async (req, res) =>{
    try{
        // Check if user is a farmer
        if (req.user.role !== "Farmer") {
            return res.status(403).json({message: "Only farmers can create products"});
        }

        const {title, description, price, stock} = req.body;
        const farmerId = req.user.id;

        if (!title || !description || !price || !stock) {
            return res.status(400).json({message: "Please fill all required fields"});
        }

        if (!req.file) {
            return res.status(400).json({message: "Product image is required"});
        }

        // Build image path - for serving files
        const imagePath = `/uploads/${req.file.filename}`;

        const product = new Product({
            farmerId,
            title,
            description,
            price: Number(price),
            stock: Number(stock),
            image: imagePath
        });

        await product.save();
        res.status(201).json({message: "Product Created", product});

    }catch(err){
        console.error("Product creation error:", err);
        res.status(500).json({message: "Failed to create product", error: err.message});
    }
};

exports.getAllProducts = async(req, res)=>{
    try {
        const products = await Product.find().populate('farmerId', 'name email');
        res.status(200).json(products);
    } catch (err) {
        console.error("Get products error:", err);
        res.status(500).json({message: "Failed to fetch products", error: err.message});
    }
};