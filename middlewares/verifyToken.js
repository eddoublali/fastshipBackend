const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Verifies the JWT token from the request headers
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No token provided");
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    console.log("📥 Received Token:", token); // Debugging log

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("✅ Decoded Token:", decoded); // Debugging log
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Token is not valid" });
    }
}

/**
 * Verifies token and checks if user is authorized to access the resource
 */
function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "Unauthorized - You can only modify your own account unless you are an admin" });
        }
    });
}

/**
 * Verifies token and checks if user is an admin
 */
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "Unauthorized - Only administrators can perform this action" });
        }
    });
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
};
