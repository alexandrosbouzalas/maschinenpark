const sjcl = require("sjcl");
const bcrypt = require("bcryptjs");

module.exports = {
  addTime: function (dt, minutes) {
    return new Date(dt.getTime() + minutes * 60000);
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
