const fs = require("fs");
const Attachment = require("../models/Attachment");

const removeAttachment = async (attachment) => {
  try {
    if (attachment.filePath && fs.existsSync(attachment.filePath))
      fs.unlinkSync(attachment.filePath);
  } finally {
    await Attachment.findByIdAndDelete(attachment._id);
  }
};

module.exports = { removeAttachment };
