var bcrypt = require('bcrypt-nodejs');

function User() {
    this.email = "" ;
    this.password = "";
    this.facebook = {
        id: "",
        token: "",
        email: "",
        name: "",
    };
};
User.prototype.setEmailLocal = function(email) {
    this.email = email;
    return this;
};
User.prototype.setPasswordLocal = function(password) {
    this.password = password;
    return this;
};
User.prototype.getPasswordLocal = function(){
    return this.password;
};
User.prototype.getEmailLocal = function(){
    return this.email;
};


// User.prototype.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

module.exports = User;