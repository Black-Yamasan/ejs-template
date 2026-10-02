const path = require('path')

const isProd = process.env.NODE_ENV === 'production'
const modeValue = isProd ? 'production' : 'development'
const OUTPUT_DIR = isProd ? './htdocs' : './dist'
const SRC_IMAGE_DIR = path.resolve(__dirname, `../src/assets/images/**/*`)
const FAVICON_FILE_PATH = path.resolve(__dirname, '../src/assets/favicon.ico')

const PORT = 3000

module.exports = {
  isProd,
  modeValue,
  OUTPUT_DIR,
  SRC_IMAGE_DIR,
  PORT,
  FAVICON_FILE_PATH
}
