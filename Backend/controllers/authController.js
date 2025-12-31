const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) =>{
    try{
        const {name, email, password, role} = req.body;

        const exists = await User.findOne({email});
        if(exists) return res.status(400).json({message: "Email already used"});

        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({name, email, password: hash, role});
        await newUser.save();

        res.status(201).json({message: "Registration successful", user: newUser});

    }catch(err){
        return res.status(500).json({message: "Registration failed", error: err.message});
    }
};

exports.login = async (req, res) =>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "User not found"});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({message: "Wrong password"});

        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET || "default_secret"
        );

        res.status(200).json({message: "Login Success", token, user});
    }catch(err){
        return res.status(500).json({message: "Login failed", error: err.message});
    }
};