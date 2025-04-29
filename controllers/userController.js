const prisma = require('../config/prisma');
const asyncHandler = require('express-async-handler');

const getUserById = asyncHandler(async (req, res) => {
   const {userId} = req.params;

   const user = await prisma.user.findUnique({
    where: {
        id: Number(userId),
    },
    });

   if(!user) {
       return res.status(404).json({message: "User not found"});
   }

   res.send(user);
});

const createNewUser = asyncHandler(async (req, res, next) => { // Add 'next' as an argument
    const { name, email, password } = req.body;

    try {
        await prisma.user.create({
            data: {
                email,
                name,
                password
            },
        });
        res.redirect("/");
    } catch (error) {
        next(error);
    };
});

module.exports = {
    getUserById,
    createNewUser
};