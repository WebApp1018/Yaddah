// __ Importing jimp __ \\
const Jimp = require('jimp');

// __ Importing filesystem = __ \\
const fs = require('fs');

// __ Importing qrcode-reader __ \\
const qrCodeReader = require('qrcode-reader');

// __ Read the image and create a buffer __ \\
// const buffer = fs.readFileSync('/output-file-path/file.png');

// __ Parse the image using Jimp.read() __ \\
exports.verifyQRCode = async (buffer) => {
  const image = await Jump.reader(buffer);

  const qrCodeInstance = new qrCodeReader();

  const decryptedResult = await qrCodeInstance.decode(image.bitmap);

  return decryptedResult;
  //   Jimp.read(buffer, function (err, image) {
  //     if (err) {
  //       console.error(err);
  //     }
  // __ Creating an instance of qrcode-reader __ \\

  // qrCodeInstance.callback = function (err, value) {
  //   if (err) {
  //     console.error(err);
  //   }
  //   // __ Printing the decrypted value __ \\
  //   console.log(value.result);
  // };

  // __ Decoding the QR code __ \\
  // qrCodeInstance.decode(image.bitmap);
  //   });
};
