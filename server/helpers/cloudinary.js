import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dyhpfkyub",
  api_key: "364358192441167",
  api_secret: "MJ48TKzU6B-Yj07x3VOCOstHWZw",
});

const storage = multer.diskStorage({
  filename: function (req,file,cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({storage: storage});


export { upload, handleUpload ,uploadToCloudinary ,cloudinary};

// const storage = new multer.memoryStorage();
// const upload = multer({
//   storage,
// });

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "image",
  });
  return res;
}


const uploadToCloudinary=  async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    res.json(cldRes);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
};


// // Configure multer storage
// const storage = new multer.CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'uploads', // Folder name in Cloudinary
//     allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed formats
//   },
// });

// const upload = multer({ storage: multer.memoryStorage() }).array('images', 10);

// Function to upload images directly from memory to Cloudinary
// const uploadToCloudinary = async (files) => {
//   try {
//     const imageUrls = [];
//     cloudinary.uploader
//     .upload("hat.jpg", { 
//       use_filename: true})
//     .then(result=>console.log(result));
//     // Loop through each file and upload to Cloudinary
//     for (const file of files) {
//       // Upload directly from buffer
//       const result = await cloudinary.uploader.upload_stream(
//         { folder: 'uploads' }, // Cloudinary folder name
//         (error, result) => {
//           if (error) {
//             throw new Error('Cloudinary upload failed: ' + error.message);
//           }
//           return result.secure_url;
//         }
//       ).end(file.buffer); // Pass the file buffer to Cloudinary
//       imageUrls.push(result);
//     }

//     return imageUrls;
//   } catch (error) {
//     throw new Error('Error uploading to Cloudinary: ' + error.message);
//   }
// };

// // Function to handle image upload to Cloudinary
// const uploadToCloudinary = (req) => {
//   return new Promise((resolve, reject) => {
//     // Use Multer to process the files
//     upload(req, {}, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         // Extract uploaded files' Cloudinary URLs
//         const uploadedFiles = req.files;
//         const imageUrls = uploadedFiles.map((file) => file.path);
//         resolve(imageUrls); // Resolve the promise with image URLs
//       }
//     });
//   });
// };

// export { uploadToCloudinary };

// const upload = multer({ storage });


// Image upload utility function
// export const imageUploadUtil = async (file) => {
//   const result = await cloudinary.uploader.upload(file, {
//     resource_type: "auto",
//   });

//   return result;
// };

// // Multer middleware
// export const upload = multer({ storage });
