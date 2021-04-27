module.exports = {
  getWards: (districtCode) => require(`./${districtCode}/index`),
}
