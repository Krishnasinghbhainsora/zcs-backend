const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Admin not found." });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded._id); // Assuming the JWT stores admin ID
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }
      req.admin = admin;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Admin not found." });
    }
  };
  

module.exports = authMiddleware;
