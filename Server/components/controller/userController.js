const router = require('express').Router();
 
const User = require('../model/userModel');
 
// Get All Users
router.get('/', async(request, response) => {
    try {
        const users = await User.find();
        response.status(200).json(users);
    } catch (error) {
        response.status(500).json({
            message: "Unable to Retrieve Users.",
            error: error.message
        })
    };
});
 
// Create New User
router.post('/create', async(request, response) => {
    try {
        const { email, name, password } = request.body;
 
        const existingUser = await User.findOne({ email: email});
        if (existingUser) {
            response.status(409).json({
                message: 'User with this email is already existing.',
                success: false
            });
        }
 
        const newUser = new User({
            email: email,
            name: name,
            password: password,
        });
 
        await newUser.save();
        response.status(201).json({
            message: 'User Created Successfully.',
            success: true,
            user: newUser
        });
 
    } catch (error) {
        response.status(500).json({
            message: 'Unable to Create User.',
            error: error.message
        })
    }
});
 
// Update User Details
router.put('/update/:id', async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        if (!user) {
            return response.status(404).json({
                message: 'User not found.',
                success: false
            });
        }
 
        const { email, name, password } = request.body;
 
        user.email = email;
        user.name = name;
        user.password = password;
 
        await user.save();
 
        response.status(200).json({
            message: 'User Updated Successfully.',
            success: true,
            user: user
        });
    } catch (error) {
        response.status(500).json({
            message: 'Unable to Update User.',
            success: false
        });
    }
});
 
// Delete User by Id
router.delete('/delete/:id', async (request, response) => {
    try {
        await User.findByIdAndDelete(request.params.id);
        response.status(200).json({
            message: "User Deleted Successfully.",
            success: true
        });
    } catch (error) {
        response.status(500).json({
            message: 'Unable to Delete User.',
            error: error.message
        });
    }
});
 
module.exports = router;