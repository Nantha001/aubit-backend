
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 cloudinary.api.ping()
    .then(() => console.log("Cloudinary ✔ Connected Successfully"))
    .catch((err) => console.log("Cloudinary ❌ Connection Failed:", err.message));


module.exports = cloudinary;
