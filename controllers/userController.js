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

const createNewFolder = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const user = req.user; // Assuming you have user ID from the session

    try {
        await prisma.folder.create({
            data: {
                name: name,
                author: {
                    connect: {
                        id: user.id, // Assuming you have user ID from the session
                    },
                },
            },
        });
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating folder" });
    }
});


const createNewFile = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const size = req.file.size; 
    const url = "/public/data/uploads/" + req.file.filename;
    const folderId = req.body.folderId; // Get folderId from req.body

    try{
        await prisma.file.create({
            data: {
                name: name,
                size: size,
                url: url,
                folder: {
                    connect: {
                        id: Number(folderId),
                    },
                },
            },
        });
        res.redirect("/folders/" + folderId); // Redirect to the folder page after creating the file
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating file" });
    }
});

const getUserWithFolders = asyncHandler(async (req, res) => {
    if (req.user) {
      const userWithFolders = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { folders: true }, // Include the folders relation
      });
      res.render("index", { user: userWithFolders });
    } else {
      res.render("index", { user: null }); // Or handle unauthenticated state
    }
  });

  const getFolderById = asyncHandler(async (req, res) => {
    const folderId = req.params.id;
  
    try {
      const folder = await prisma.folder.findUnique({
        where: { id: Number(folderId) },
        include: { files: true }, // Include the files relation
      });
  
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }
      res.render("folder", { folder: folder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving folder" });
    }
  });

module.exports = {
    getUserById,
    createNewUser,
    createNewFolder,
    createNewFile,
    getUserWithFolders,
    getFolderById
};