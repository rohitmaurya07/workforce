import multer from "multer"

const allowedMimeTypes = [
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // PowerPoint
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Text
  "text/plain",
  "text/csv",

  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",

  // Archives
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",

  // Code
  "application/json",
  "text/html",
  "text/css",
  "application/javascript",
  "text/javascript",
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

export const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});