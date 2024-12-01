var admin = require("firebase-admin");

var serviceAccount = require("../constants2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin