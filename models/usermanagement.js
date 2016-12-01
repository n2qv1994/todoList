var User = require('../entity/user.js');

function UserManagement(connection) {
    this.connection = connection;
};

UserManagement.prototype.findById = function(id, callback) {
    var ObjectId =  'ObjectId("'+id+'")';
    this.connection.collection('client').find({ _id : ObjectId }, function(err, user) {    
        return callback(err, user);
    })
};

UserManagement.prototype.signupLocal = function(email,password, callback) {
	var _this = this;
    var newuser = new User();
    _this.connection.collection('client').findOne({ email: email }, function(err, user) {
        if (err){
            return callback(err, false);
        }
        if (user) {
            return callback(null, false);
        } else {
            // newuser.setEmailLocal(email).setPasswordLocal(password);
            newuser.email = email;
            newuser.password = password;
            // console.log(";;;;;;;;"+user.email);
            _this.connection.collection('client').save(newuser, function(err) {
                if(err) throw err;
                return callback(null, newuser);
            })
        }

    });
};

UserManagement.prototype.loginLocal = function(email,password, callback) {
	var _this = this;
    _this.connection.collection('client').findOne({ email : email }, function(err, user) {
        if (err){
            return callback(err, false);
        }
        if (user.email == email && user.password == password) {
            return callback(null, user);
        }
        else{
        	return callback(null,false);
        }
    });
};

UserManagement.prototype.loginWithFacebook = function(profile,token, callback){
	var _this = this;
	_this.connection.collection('client').findOne({'facebook.id': profile.id}, function(err,user){
        if(err) return callback(err,null);
        if (user) return  callback(null,user);
        else {
            newuser = new User();
            // user
            // .setFacebookId(profile.id)
            // .setFacebookEmail(profile.emails[0].value)
            // .setFacebookToken(token)
            // .setFacebookName(profile.name);
            newuser.facebook.id = profile.id;
            newuser.facebook.email = profile.emails[0].value;
            newuser.facebook.token = token;
            newuser.facebook.name = profile.name;
            _this.connection.collection('client').save(newuser, function(err) {
                if(err) throw err;
                return callback(null, newuser);
            })

        }
    });

}

module.exports = UserManagement;