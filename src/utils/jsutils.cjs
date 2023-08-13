const crypto = require('crypto');

module.exports= {
  getPasswordHash:(password)=> crypto.createHash('sha256').update(password).digest('base64')
}
