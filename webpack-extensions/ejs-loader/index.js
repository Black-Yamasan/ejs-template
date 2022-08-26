const path = require('path')
const ejs = require('ejs')

module.exports = function(source) {
  const fileName = path.basename(this.resourcePath)
  const file = this._module.rawRequest
  let _source = source
  
  const regExp = new RegExp(`./src/templates/pages/`)
  const outputFilePath = file.replace(regExp, '')
  const filePathLength = file.split('/').length
  const outputFileName = file.split('/')[filePathLength-1]
  const excludedExtensionFileName = outputFileName.split('.')[0]
  const fileDirectory = outputFilePath.replace(outputFileName, '')
  
  const sourceFileName = `${fileDirectory}/${fileName}`
  const outputFile = `${fileDirectory}${excludedExtensionFileName}.html`
  const assetInfo = { sourceFilename: sourceFileName }  

  ejs.renderFile(this.resourcePath, (err, str) => {
    _source = str
  })
  
  this.emitFile(outputFile, _source, null, assetInfo)
  
  return `export default ${JSON.stringify(_source)}`
}

