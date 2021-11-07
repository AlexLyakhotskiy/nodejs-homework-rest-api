const multer = require('multer');
const gravatar = require('gravatar');
const path = require('path');
const { BadRequest } = require('http-errors');

const tmpFileDir = path.join(__dirname, '../../tmp');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpFileDir);
  },
  filename: function (req, file, cb) {
    try {
      const isImage = file.mimetype.includes('image');
      if (!isImage) {
        throw new BadRequest();
      }

      const { ext } = path.parse(file.originalname);
      const avatarUrl = gravatar.url(req.body?.email || req.user.email);
      const strCutFrom = 'avatar/';
      const avatarName = avatarUrl.slice(
        avatarUrl.indexOf(strCutFrom) + strCutFrom.length,
      );

      req.body = { ...req.body };

      cb(null, `${avatarName}${ext}`);
    } catch (error) {
      cb(new BadRequest());
    }
  },
});

exports.upload = multer({ storage });
