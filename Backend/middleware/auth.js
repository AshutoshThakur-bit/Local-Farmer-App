const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    
    if(!authHeader) return res.status(401).json({message: "No token provided"});

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith("Bearer ") 
        ? authHeader.slice(7) 
        : authHeader;

    jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err, user)=>{
        if(err) return res.status(403).json({message: "Invalid token"});

        req.user = user;
        next();
    });
};