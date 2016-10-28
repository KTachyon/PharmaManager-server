var rekuire = require('rekuire');
var User = rekuire('models/User');

User.create({ name : process.argv[2], email : process.argv[3], password : process.argv[4] }).then(() => { console.log('Done!'); });
