import path from 'path';
import multer from 'multer';

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, // 50MB limit //new
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).array('images', 10); // Max 10 images

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Upload images
export const uploadImages = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }
    if (req.files === undefined) {
      return res.status(400).json({ msg: 'No file selected' });
    }
    next(); // Proceed to the next middleware/controller
  });
};
