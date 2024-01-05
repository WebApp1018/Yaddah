const fs = require('fs');
const sharp = require('sharp');
const { uploadFunction } = require('./fileUpload');

exports.uploadFilesToS3 = async (files, key, index, quality) => {
  const newFilename = files[key][index].filename;
  const filePath = process.cwd() + '/uploads/' + newFilename;
  const readFile = fs.readFileSync(filePath);
  const fileBuffer = Buffer.from(readFile);
  const fileFormat = files[key][index].mimetype.split('/')[1];
  let _sharp;

  if (fileFormat == 'jpeg' || fileFormat == 'jpg')
    _sharp = await sharp(fileBuffer)
      .resize()
      .toFormat(fileFormat)
      .jpeg({ quality })
      .toBuffer();
  else if (fileFormat == 'gif')
    _sharp = await sharp(fileBuffer)
      .resize()
      .toFormat(fileFormat)
      .gif()
      .toBuffer();
  else if (fileFormat == 'png')
    _sharp = await sharp(fileBuffer)
      .resize()
      .toFormat(fileFormat)
      .png({ quality })
      .toBuffer();
  else _sharp = fileBuffer;

  await uploadFunction(_sharp, newFilename);
  fs.unlinkSync(filePath);
  return newFilename;
};
