const axios = require('axios')

module.exports = axios.create({
  timeout: 8000,
})
