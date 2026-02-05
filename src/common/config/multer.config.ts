import { diskStorage, memoryStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

// Determine a writable base upload path. Prefer UPLOAD_DIR env var, then use /tmp for serverless (Lambda), otherwise local ./uploads
const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.LAMBDA_TASK_ROOT;
export const BASE_UPLOAD_PATH = process.env.UPLOAD_DIR || (isLambda ? '/tmp/uploads' : './uploads');

function ensureDir(dir: string): boolean {
  try {
    fs.mkdirSync(dir, { recursive: true });
    return true;
  } catch (err) {
    console.warn(`Failed to create upload dir ${dir}:`, err && err.message ? err.message : err);
    return false;
  }
}

function createStorageFor(subPath: string) {
  const dest = join(BASE_UPLOAD_PATH, subPath);
  if (ensureDir(dest)) {
    return diskStorage({
      destination: dest,
      filename: (req, file, callback) => {
        const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
        callback(null, uniqueName);
      },
    });
  }
  // Fallback to memory storage when disk isn't writable (useful in serverless environments)
  return memoryStorage();
}

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
  const allowedMimeTypes = /^application\/(vnd\.ms-powerpoint|vnd\.openxmlformats-openxmlformats-officedocument\.presentationml\.presentation|pdf)$/;

  if (!allowedExtensions.test(file.originalname) && !allowedMimeTypes.test(file.mimetype)) {
    return callback(
      new BadRequestException('Only PPT/PPTX/PDF files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

// Video and PPT storage engines (disk when possible, memory otherwise)
export const videoStorage = createStorageFor('videos');
export const pptStorage = createStorageFor('ppts');

// File size limits
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
export const MAX_PPT_SIZE = 50 * 1024 * 1024; // 50MB

