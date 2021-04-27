const path = require('path')
const fs = require('fs')

const rootDir = path.resolve(__dirname, '..')
const sourceDir = path.resolve(rootDir, 'sources')
const libDir = path.resolve(rootDir, 'libs')
const requireModule = (modulePath) => {
  try {
    return require(modulePath)
  } catch (e) {
    return {}
  }
}

const provinceTemplate = (data) => `
module.exports = ${data}
`
const districtListTemplate = (data) => `
module.exports = ${data}
`
const districtTemplate = (data) => `
const districts = ${data}

module.exports = {
  districts,
  getDistricts: (provinceCode) => districts.filter((d) => d.parent_code === provinceCode),
}
`
const wardTemplate = (data) => `
module.exports = ${data}
`

const writeToFile = (targetPath, data) =>
  fs.writeFileSync(targetPath, data, { encoding: 'utf8' })

const writeToProvince = ({ provinces, map }, targetDir) => {
  const provincesStr = JSON.stringify(provinces, null, 2)
  const provinceMapStr = JSON.stringify(map, null, 2)
  writeToFile(path.join(targetDir, 'index.js'), provinceTemplate(provincesStr))
  writeToFile(path.join(targetDir, 'map.js'), provinceTemplate(provinceMapStr))
}

const generateProvinces = (sourcePath, targetPath) => {
  const provinceModule = requireModule(sourcePath)
  const pCodes = Object.keys(provinceModule)
  const provinces = pCodes.map((code) => provinceModule[code])
  writeToProvince({ provinces, map: provinceModule }, targetPath)
}

const writeToDistrict = ({ districts, map }, targetDir) => {
  const districtStr = JSON.stringify(districts, null, 2)
  const districtMapStr = JSON.stringify(map, null, 2)
  writeToFile(path.join(targetDir, 'index.js'), districtTemplate(districtStr))
  writeToFile(path.join(targetDir, 'map.js'), districtTemplate(districtMapStr))
}

const writeDistrictToProvinceDir = ({ districts }, targetPath) => {
  const districtStr = JSON.stringify(districts, null, 2)
  writeToFile(targetPath, districtListTemplate(districtStr))
}

const generateDistricts = (sourcePath, targetPath) => {
  const distModule = requireModule(sourcePath)
  const dCodes = Object.keys(distModule)
  const districts = dCodes.map((code) => distModule[code])
  writeToDistrict({ districts, map: distModule }, targetPath)

  // write separate provinces
  const provincesDistricts = districts.reduce((provinces, d) => {
    if (!provinces[d.parent_code]) {
      provinces[d.parent_code] = []
    }
    provinces[d.parent_code].push(d)
    return provinces
  }, {})

  const provinces = Object.keys(provincesDistricts)

  const provinceDirPath = path.join(targetPath, 'provinces')
  provinces.forEach((p) => {
    const provinceFilePath = path.join(provinceDirPath, `${p}.js`)
    if (!fs.existsSync(provinceDirPath)) {
      fs.mkdirSync(provinceDirPath)
    }
    writeDistrictToProvinceDir(
      { districts: provincesDistricts[p] },
      provinceFilePath
    )
  })
}

const writeToWards = ({ wards, map }, targetDir) => {
  const wardStr = JSON.stringify(wards, null, 2)
  const wardMapStr = JSON.stringify(map, null, 2)
  writeToFile(path.join(targetDir, 'index.js'), wardTemplate(wardStr))
  writeToFile(path.join(targetDir, 'map.js'), wardTemplate(wardMapStr))
}

const generateWards = (sourcePath, targetPath) => {
  const files = fs.readdirSync(sourcePath)

  files.forEach((f) => {
    const filePath = path.join(sourcePath, f)
    const districtDir = path.basename(f).replace(/\.[a-z]+$/, '')
    const wardModule = requireModule(filePath)
    const wCodes = Object.keys(wardModule)
    const wards = wCodes.map((code) => wardModule[code])
    const districtDirPath = path.join(targetPath, districtDir)
    if (!fs.existsSync(districtDirPath)) {
      fs.mkdirSync(districtDirPath)
    }
    writeToWards({ wards, map: wardModule }, districtDirPath)
  })
}

generateProvinces(
  path.join(sourceDir, 'provinces.json'),
  path.join(libDir, 'provinces')
)

generateDistricts(
  path.join(sourceDir, 'districts.json'),
  path.join(libDir, 'districts')
)

generateWards(path.join(sourceDir, 'wards'), path.join(libDir, 'wards'))
