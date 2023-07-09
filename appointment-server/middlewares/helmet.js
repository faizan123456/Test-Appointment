const helmet = require('helmet');

module.exports = [
  helmet({ contentSecurityPolicy: false }),
  helmet.xssFilter({ setOnOldIE: true }),
  helmet.referrerPolicy({ policy: 'same-origin' })
];
