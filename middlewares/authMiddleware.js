import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access Denied. No token provided" });
    }

    const token = authHeader.split(" ")[1];


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
       

        req.user = decoded; 
        next(); 
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

export default verifyToken;
