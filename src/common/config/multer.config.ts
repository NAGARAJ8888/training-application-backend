import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';

// Video file filter
export const videoFileFilter = (req, file, callback) => {
  const allowedExtensions = /\.(mp4|avi|mov|wmv|flv|mkv|webm)$/i;
  const allowedMimeTypes = /^video\//;

  if (!allowedExtensions.test(file.originalname) && !allowedMimeTypes.test(file.mimetype)) {
    return callback(
      new BadRequestException('Only video files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

// PPT file filter
export const pptFileFilter = (req, file, callback) => {
  const allowedExtensions = /\.(ppt|pptx|pdf)$/i;
  const allowedMimeTypes = /^application\/(vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation|pdf)$/;

  if (!allowedExtensions.test(file.originalname) && !allowedMimeTypes.test(file.mimetype)) {
    return callback(
      new BadRequestException('Only PPT/PPTX/PDF files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

// Video storage configuration
export const videoStorage = diskStorage({
  destination: './uploads/videos',
  filename: (req, file, callback) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

// PPT storage configuration
export const pptStorage = diskStorage({
  destination: './uploads/ppts',
  filename: (req, file, callback) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

// File size limits
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
export const MAX_PPT_SIZE = 50 * 1024 * 1024; // 50MB

