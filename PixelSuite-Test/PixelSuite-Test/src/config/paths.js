const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const DOWNLOADS_DIR = path.join(ROOT_DIR, 'downloads');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'screenshots');

module.exports = {
  ROOT_DIR,
  UPLOADS_DIR,
  DOWNLOADS_DIR,
  SCREENSHOTS_DIR,
};
