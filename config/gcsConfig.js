const fs = require('fs');
fs.writeFileSync(process.env['GCS_KEYFILE'], process.env['GCS_CRED']);