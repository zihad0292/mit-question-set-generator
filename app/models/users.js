/**
 * Created by Rajesh on 6/18/19. Modified by Zihad Ul Islam Mahdi on 8/28/19.
 */

var mongoose = require('mongoose');
var md5 = require('md5');
var Schema =  mongoose.Schema;

var bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 5;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var usersSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'User Password cannot be empty']
    },
    type: {
        type: String,
        enum : ['admin','super-admin'],
        default: 'admin'
    },
    secondary_key: {type: String},
    office_name: {type: String, trim: true, required: [true, "Office Name Must be Filled"]},
    office_id  : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'offices'
    },
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

usersSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

usersSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('email')) return next();

    var secondary = user.office_name + ' ' + user.email;
    user.secondary_key = md5(secondary);
    next();
});

usersSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// we need to create a model using it
var User = mongoose.model('user', usersSchema);

module.exports = {
    model: User,

    create: function (params, result) {
        var userInfo = new User(params);

        var error = userInfo.validateSync();

        if(error){
            result(error, null);
        }else{
            userInfo.save(function (err) {
                if(err){
                    result(err, null);
                }else{
                    result(null, true);
                }
            });
        }
    },

    getAll: function (response) {
        User
            .find({})
            .limit(10)
            .sort({ created_at: -1 })
            .exec(function (err, users) {
                if(err){
                    response(err, null);
                }else{
                    response(null, users);
                }
            })
    },
    
    find: function (params, response) {
        User.find(params)
            .limit(10)
            .sort({ created_at: -1 })
            .exec(function (err, users) {
                if(err){
                    response(err, null);
                }else{
                    response(null, users);
                }
            })
    },

    update: function (id, params, result) {
        User
            .findOneAndUpdate({_id: id}, params, {runValidators: false}, function (err) {
                if (err) {
                    result(err, null);
                } else {
                    result(null, true);
                }
            });
    },

    delete: function (id, result) {
        User.deleteOne({_id: id}, function (err) {
                if (err) {
                    result(err, null);
                } else {
                    result(null, true);
                }
            });
    },

    deleteMany: function (id) {
        User.deleteMany({office_id: id}, function (err) {
            if (err) {
                console.log("Error Deleting Users");
            }
        });
    },
};