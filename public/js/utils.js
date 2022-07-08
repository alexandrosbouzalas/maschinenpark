const sjcl = require("sjcl");
const bcrypt = require("bcryptjs");

module.exports = {
  generateToken: function () {
    const seed = (Math.random() + 1).toString(36).substring(7);

    const bitArray = sjcl.hash.sha256.hash(seed);
    return sjcl.codec.hex.fromBits(bitArray);
  },

  bcryptHash: async function (password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  bcryptCompare: async function (password, user) {
    return await bcrypt.compare(password, user.password);
  },

  validatePassword: function (password) {
    if (password.toString().length < 8)
      return false;
    else return true;
  },

  validateUserId: function (userId) {
    if (userId.toString().length < 7) 
      return false;
    else return true;
  },
};
