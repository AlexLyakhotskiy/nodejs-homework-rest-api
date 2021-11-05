const Jimp = require('jimp');
const path = require('path');
const { promises: fsPromises } = require('fs');

const avatarDir = path.join(__dirname, '../../public/avatars');

async function minifyImage(req, res, next) {
  if (!req.file) {
    return next();
  }
  const file = await Jimp.read(req.file.path);

  await fsPromises.unlink(req.file.path);

  await file
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(req.file.path);

  await fsPromises.rename(
    req.file.path,
    path.join(avatarDir, req.file.filename),
  );

  next();
}

exports.minifyImage = minifyImage;
