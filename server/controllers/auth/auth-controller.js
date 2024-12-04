import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import sendEmail from "../../helpers/email.js";
import crypto from "crypto";

const prisma = new PrismaClient();

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const checkUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // Generate reset code and hash it
    const resetCode = Math.floor(Math.random() * 899999 + 100000).toString();
    const hashCode = crypto.createHash("md5").update(resetCode).digest("hex");

    // Update the user in the database
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetCode: hashCode,
        passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiration
        passwordResetVerified: false,
      },
    });

    const message = `Hi ${checkUser.userName}, 
    You have received the following reset code:
    ${resetCode}
    This code is valid for 10 minutes.`;

    // Send the reset email
    await sendEmail({
      email: checkUser.email,
      subject: "Your password reset code (valid for 10 minutes)",
      message: message,
    });

    res.status(200).json({
      success: true,
      message: "Reset code sent to email",
    });
  } catch (err) {
    console.error(err);

    // Rollback any password reset information in case of an error
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetCode: null,
        passwordResetExpires: null,
        passwordResetVerified: null,
      },
    });

    res.status(500).json({
      success: false,
      message: "There was a problem resetting your password",
    });
  }
};

// after Sending the reset email verify the code with new password and Confirm Password
export const verifyResetCode = async (req, res, next) => {
  const { email , otp } = req.body;
  try {
    // Hash the provided reset code
    const hashResetCode = crypto
      .createHash("md5")
      .update(otp)
      .digest("hex");

    // Find the user by reset code and check if the code is still valid
    const user = await prisma.user.findFirst({
      where: {
        email:email,
        passwordResetCode: hashResetCode,
      },
    });
    
    if (!user) {
      return res.json({
        success: false,
        message: "Reset code invalid or expired",
      });
    }

    // Hash the new password
    // const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // // // Update the user with the new password
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetCode: null,
        passwordResetExpires: null,
        passwordResetVerified: true,
        // passwordChangedAt: new Date(),
      },
    });

    res
      .status(200)
      .json({ success: true, message: "OTP verification successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
//Update Password
// Function to create JWT token
// const createToken = (userId) => {
//   return jwt.sign({ id: userId }, "CLIENT_SECRET_KEY", { expiresIn: "60m" });
// };

export const updatePassword = async (req, res) => {
  const {email, password} = req.body
  try {
    // Find the user by the current logged-in user's id
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the current password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "The current password is incorrect",
      });
    }

    // Check if newPassword and confirmPassword match
    // if (req.body.newPassword !== req.body.confirmPassword) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "New password and confirm password do not match",
    //   });
    // }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(password, 12);

    // Update the user's password in the database
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedNewPassword,
        // passwordChangedAt: new Date(),
      },
    });

    // Generate a new token for the user
    const tokenLogin =  jwt.sign(
      {
        id: parseInt(user.id),
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // Send response with the new token
    res.status(200).json({
      status: "success",
      data: {
        token: tokenLogin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the password",
    });
  }
};

// Register User
export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    
    const newUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashPassword,
      },
    });

    // const newCart = await prisma.cart.create({
    //   data:{
    //     userId:newUser.id,
    //     // items:[],
    //   }
    // })

    res.status(200).json({
      success: true,
      message: "Registration successful",
      data: newUser,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);

    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    const token = jwt.sign(
      {
        id: parseInt(checkUser.id),
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: parseInt(checkUser.id),
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

// Auth Middleware
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};
