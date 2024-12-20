import Admin from '../models/admin.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { generateOTP, sendEmail, upload_JobQuotation_File_Single } from '../utils/helpers.js';
export const File_Storage = multer.memoryStorage();
// @desc    Signup a new user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(400).json({ message: 'Email already exists and is verified. Cannot sign up again.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes otp expiry

    const newUser = existingUser || new Admin({
      email,
      password: hashedPassword,
      otp: { code: otp, expiry: otpExpiry },
      isEmailVerified: false
    });

    if (!existingUser) {
      await newUser.save();
    } else {
      newUser.otp = { code: otp, expiry: otpExpiry };
      await newUser.save();
    }

    // Send OTP Email
    // const emailContent = `Your OTP for verification is: ${otp}`;
    // await sendEmail(email, 'Verify your email', emailContent);
    const mailSent = await sendEmail(
      email,
      "Verify your email",
      `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Mr. Quick Fix</title>
            
        
        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #FB4700;text-decoration:none;font-weight:600">Mr Quick </a>
            </div>
              <p style="font-size:1.1em;margin: 0 auto;width: max-content;">Hi,</p>
          <p style="margin: 0 auto;width: max-content;"> Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes </p>
            <h2 style="background:#FB4700;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          
            <p style="font-size:0.9em;">Regards,<br />Mr. Quick Fix</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Mr Quick Fix PH</p>
                <p>Philippines</p>
            </div>
            </div>
        </div>
        <!-- partial -->
            
        </body>
        </html>`,
      // {
      //     filename: `Quotation.pdf`,
      //     path: data.url
      // }
    )

    res.status(201).json({ message: 'User created or OTP resent, OTP sent!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changeProfilePicture = async (req, res) => {
  const { id } = req.params;
  try {
    const existingProfile = await Admin.findOne({ _id: id });
    if (!existingProfile) res.status(400).json({ message: "This ID is unknown, please try again" });
    if (existingProfile.profilePublickey) await cloudinary.uploader.destroy(existingProfile.profilePublickey)
    const buffer = req.file.buffer;
    const data = await upload_JobQuotation_File_Single(buffer);
    await Admin.updateOne({
      _id: id
    }, {
      $set: {
        profilePicture: data.url,
        profilePublickey: data.public_id
      }
    }
    )
    res.status(201).json({ message: 'User profile picture change successfully!' });
  }
  catch (error) {
    console.error('Error during changing profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// @desc    Verify OTP code
// @route   POST /api/auth/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (user.otp.expiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isEmailVerified = true;
    user.otp = { code: null, expiry: null };
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Resend OTP code
// @route   POST /api/auth/resend-otp
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const newOTP = generateOTP();
    const newExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes timer before resend OTP

    user.otp = { code: newOTP, expiry: newExpiry };
    await user.save();

    // const emailContent = `Your new OTP is: ${newOTP}`;
    // await sendEmail(email, 'New OTP Request', emailContent);
    const mailSent = await sendEmail(
      email,
      "New OTP Request",
      `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Mr. Quick Fix</title>
          
      
      </head>
      <body>
      <!-- partial:index.partial.html -->
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #FB4700;text-decoration:none;font-weight:600">Mr Quick </a>
          </div>
          <p style="font-size:1.1em;margin: 0 auto;width: max-content;">Hi,</p>
          <p style="margin: 0 auto;width: max-content;"> Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes </p>
          <h2 style="background:#FB4700;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${newOTP}</h2>
        
          <p style="font-size:0.9em;">Regards,<br />Mr. Quick Fix</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>Mr Quick Fix PH</p>
              <p>Philippines</p>
          </div>
          </div>
      </div>
      <!-- partial -->
          
      </body>
      </html>`,
      // {
      //     filename: `Quotation.pdf`,
      //     path: data.url
      // }
    )

    res.json({ message: 'New OTP sent!' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Complete user registration (save additional info)
// @route   POST /api/auth/complete-registration
export const completeRegistration = async (req, res) => {
  try {
    const { email, firstName, lastName, phone } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    await user.save();

    res.json({ message: 'Registration complete!' });
  } catch (error) {
    console.error('Error completing registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login an existing user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or does not exist.' });
    }

    if (user.adminStatus === 'inactive') {
      return res.status(400).json({ message: 'Your account is inactive. Please contact other admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password incorrect. Please try again!' });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({ message: 'Email not verified. Contact other admins for verification' });
    }

    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '8h' }); // Token expires in 8 hours

    user.loginDate = new Date();
    await user.save();

    res.json({ message: 'Logged in successfully', user, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Initiate forgot password (send reset link)
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found. Please try again.' });
    }

    if (user.adminStatus === 'inactive') {
      return res.status(400).json({ message: 'Your account email is inactive. Please contact other admin.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    user.resetPasswordToken = { token: resetToken, expiry: tokenExpiry };
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailContent = `Click this link to reset your password: ${resetLink}\n\nThis link will expire in 30 minutes. If you did not request this, please ignore this email.`;
    await sendEmail(email, 'Password Reset Request', emailContent);

    res.json({ message: 'Password reset email sent! Check your email' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset the user's password 
// @route   POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await Admin.findOne({
      'resetPasswordToken.token': token,
      'resetPasswordToken.expiry': { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'The password reset link has expired. Please send a new request' });
    } else if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    } else if (newPassword.length > 32) {
      return res.status(400).json({ message: 'Password must be at most 32 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    user.resetPasswordToken = undefined;
    await user.save();

    res.json({ message: 'Password reset successful!' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Logout a user
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization required. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.logoutDate = new Date();
    await user.save();

    res.json({ message: 'Logged out successfully', logout: true });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get data of logged-in user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: 'Authorization required. No token provided.' });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await new Promise((resolve, reject) =>
      jwt.verify(token, process.env.JWT_SECRET, (err, data) => (err ? reject(err) : resolve(data)))
    );

    if (!decoded?.userId) {
      return res.status(401).json({ message: 'Token verification failed.' });
    }

    const user = await Admin.findById(decoded.userId).select('-password -otp -resetPasswordToken');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


// @desc    Fetch all admins
// @route   GET /api/auth/admin
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password -otp -resetPasswordToken');
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(500).json({ success: false, message: "Server Error: Failed to fetch admins" });
  }
};

// @desc    Update a user
// @route   patch /api/auth/admin/:id
export const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, message: "Server Error: Failed to update user" });
  }
};

// @desc    Deactivate an admin user (set status to 'inactive')
// @route   PATCH /api/auth/admin/:id
export const deactivateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, { adminStatus: 'inactive' }, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, message: "Server Error: Failed to update user" });
  }
};

// @desc    Activate an admin user (set status to 'active')
// @route   PATCH /api/auth/admin/activate/:id
export const activateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, { adminStatus: 'active' }, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, message: "Server Error: Failed to update user" });
  }
};

// @desc  Delete a admin user
// @route   DELETE /api/auth/admin/:id
export const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ success: true, data: deletedAdmin });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ success: false, message: "Server Error: Failed to delete user" });
  }
};