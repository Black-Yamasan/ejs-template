const path = require('path')

const isProd = process.env.NODE_ENV === 'production'
const modeValue = isProd ? 'production' : 'development'
const OUTPUT_DIR = isProd ? './htdocs' : './dist'
const SRC_IMAGE_DIR = path.resolve(__dirname, `./src/images/**/*`)

const PORT = 3000

module.exports = {
  isProd,
  modeValue,
  OUTPUT_DIR,
  SRC_IMAGE_DIR,
  PORT
}
