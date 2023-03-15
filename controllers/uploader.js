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