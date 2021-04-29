module.exports = {
  getWards: (districtCode) => {
    try {
      return require(`./${districtCode}/index`)
    } catch (_) {
      return []
    }
  },
}
