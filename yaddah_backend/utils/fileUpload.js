const S3 = require('aws-sdk/clients/s3');
const AwsConf = require('../awsConfig.json');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const AppError = require('./appError');
const path = require('path');
const fs = require('fs');

const fileBucket = AwsConf.AWS_IMAGE_BUCKET_NAME;
// const pdfBucket = AwsConf.AWS_PDF_BUCKET_NAME;
const pdfBucket = AwsConf.AWS_IMAGE_BUCKET_NAME;
const region = AwsConf.AWS_BUCKET_REGION;
const accessKeyId = AwsConf.AWS_ACCESS_KEY;
const secretAccessKey = AwsConf.AWS_SECRET_KEY;
const endPoint = AwsConf.AWS_ENDPOINT;

const s3 = new S3({
  endpoint: endPoint,
  region,
  accessKeyId,
  secretAccessKey,
});

// Returns a list of objects in your specified path.
const listOfFilesInABucket = async () => {
  try {
    const data = await s3.listObjectsV2({ Bucket: fileBucket }).promise();
    console.log('Success', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

const createS3Bucket = async () => {
  try {
    const data = await s3.createBucket({ Bucket: fileBucket }).promise();
    console.log({ data });
  } catch (err) {
    console.log('Error', err);
  }
};

const deleteS3Bucket = async () => {
  try {
    const data = await s3.deleteBucket({ Bucket: fileBucket }).promise();
    console.log({ data });
  } catch (err) {
    console.log('Error', err);
  }
};

const deleteFileFromS3 = (fileKey) => {
  const deleteParams = {
    Key: fileKey,
    Bucket: fileBucket,
  };

  return s3.deleteObject(deleteParams).promise();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const uploadImage = (req, file, cb) => {
  if (
    [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    const dir = process.cwd() + '/uploads';
    fs.rmdirSync(dir, { recursive: true });
    return cb(
      new AppError(
        'Only jpg, jpeg, png, webp, doc, docx, ppt, pptx, & pdf format is allowed.',
        400
      )
    );
  }
};

exports.uploadSharpImage = multer({
  storage,
  fileFilter: uploadImage,
}).fields([
  {
    name: 'images',
    maxCount: 20,
  },
  {
    name: 'venueImages',
    maxCount: 5,
  },
  {
    name: 'serviceImages',
    maxCount: 5,
  },
  {
    name: 'commercialLicense',
    maxCount: 1,
  },
  {
    name: 'photo',
    maxCount: 1,
  },
  {
    name: 'image',
    maxCount: 1,
  },
  {
    name: 'catImage',
    maxCount: 1,
  },
  {
    name: 'video',
    maxCount: 1,
  },
  {
    name: 'home_slider_images',
    maxCount: 7,
  },
  {
    name: 'home_section1_image',
    maxCount: 1,
  },
  {
    name: 'home_section2_image',
    maxCount: 1,
  },
  {
    name: 'home_section4_image',
    maxCount: 1,
  },
  {
    name: 'home_section4_bgImage',
    maxCount: 1,
  },
  {
    name: 'home_section5_bgImage',
    maxCount: 1,
  },
  {
    name: 'about_section2_image',
    maxCount: 1,
  },
  {
    name: 'about_section3_image',
    maxCount: 1,
  },
  {
    name: 'about_section3_bgImage',
    maxCount: 1,
  },
  {
    name: 'about_section4_bgImage',
    maxCount: 1,
  },
]);

exports.getUploadingSignedURL = async (Key, Expires = 15004) => {
  try {
    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: fileBucket,
      Key: Key,
      Expires,
    });
    return url;
  } catch (error) {
    return error;
  }
};

function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: fileBucket,
  };

  return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;

exports.deleteFile = (fileKey) => {
  const deleteParams = {
    Key: fileKey,
    Bucket: fileBucket,
  };

  return s3.deleteObject(deleteParams).promise();
};

function getPDFFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: pdfBucket,
  };

  return s3.getObject(downloadParams).createReadStream();
}

function uploadFunction(fileBuffer, key) {
  const params = {
    Body: fileBuffer,
    Bucket: fileBucket,
    Key: key,
  };
  return s3.putObject(params).promise();
}

exports.uploadServerFile = (filePath, isUploadPdf) => {
  const fileContent = fs.createReadStream(filePath);
  // console.log({ fileContent });

  const params = {
    Bucket: fileBucket,
    Key: path.basename(filePath),
    Body: fileContent,
    ...(isUploadPdf && { ContentType: 'application/pdf' }),
  };

  return s3.upload(params).promise();
};

exports.getPDFFileStream = getPDFFileStream;
exports.uploadFunction = uploadFunction;
