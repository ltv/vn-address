const { getDistricts } = require('../provinces/index')
const { getWards } = require('../districts/index')

const districts = getDistricts('30')
const wards = getWards('292')

console.log('districts: ', districts)
console.log('wards: ', wards)
