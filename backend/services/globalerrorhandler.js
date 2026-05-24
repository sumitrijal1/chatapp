// middlewares/errorHandler.js
export default (err, req, res, next) => {

  // MySQL duplicate entry
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      message: "Email already exists"
    });
  }

  // Foreign key error
  if (err.code === "ER_NO_REFERENCED_ROW") {
    return res.status(400).json({
      message: "Invalid reference"
    });
  }

  // Default error
  return res.status(500).json({
    message: err.message || "Internal Server Error"
  });
};