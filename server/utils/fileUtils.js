// utils/fileUtils.js

export const isImage = (mimetype) => {
  return mimetype.startsWith("image/");
};

export const isVideo = (mimetype) => {
  return mimetype.startsWith("video/");
};
