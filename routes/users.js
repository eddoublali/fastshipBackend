const express = require("express");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");


const  {verifyTokenAndAuthorization,verifyTokenAndAdmin,verifyToken} = require("../middlewares/verifyToken");
const router = express.Router();
const {
    User,
    validateUpdateUser
} = require("../models/User");


/**
 * @desc Update user
 * @route PUT /api/users/:id
 * @method PUT
 * @access private
 */
router.put('/:id', verifyTokenAndAuthorization, asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = validateUpdateUser(req.body);
  if (error) {
      return res.status(400).json({ message: error.details[0].message });
  }

  // Handle password update if provided
  if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
        $set: {
            email: req.body.email,
            username: req.body.username,
            ...(req.body.password && { password: req.body.password })
        }
    },
    { new: true }
).select("-password");


  if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(updatedUser);
}));
   
/**
 *  @desc get all  user
 *  @route POST /api/users/:id
 *  @method POST
 *  @access private
 */
router.get('/',verifyTokenAndAdmin, asyncHandler(
    async (req, res) => {
      const users=await User.find().select("-password");
      res.status(200).json(users)
         }));
   

module.exports = router;