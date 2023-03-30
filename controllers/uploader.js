const express = require("express");
const multer = require('multer');
const path = require('path');

// Configure multer storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
      cb(null, fileNameWithoutExt + '-' +  file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Initialize multer middleware
  const upload = multer({
    storage: storage
  });

  module.exports = {
   upload,
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/images');
//   },
//   filename: function (req, file, cb) {
//       const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
//     cb(null, fileNameWithoutExt + '-' +  file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({
// storage: storage,
// fileFilter: function (req, file, cb) {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// },
// limits: {
//   fileSize: 1024 * 1024 * 2 // 2MB file size limit
// }
// }).array('images', 4); // Handle multiple files with field name 'images' and up to 4 files

// module.exports = {
// upload
// };
