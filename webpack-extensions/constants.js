import path from 'node:path'

export const isProd = process.env.NODE_ENV === 'production'
export const modeValue = isProd ? 'production' : 'development'
export const OUTPUT_DIR = isProd ? './htdocs' : './dist'
export const SRC_IMAGE_DIR = path.resolve(path.dirname(''), `./src/assets/images/**/*`)
export const FAVICON_FILE_PATH = path.resolve(path.dirname(''), './src/assets/favicon.ico')

export const PORT = 3000
