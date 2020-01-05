/**
 * Created by Rajesh on 6/12/19. Modified by Zihad Ul Islam Mahdi on 8/28/19. removing user and other data when office is deleted
 */
var DBConfig = require('./dbConfig');

var md5 = require('md5');

var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var officeSchema = new Schema({
    name: {type: String, unique: true, required: [true, 'Office Name cannot be empty']},
    location: {type: String},
    primary_key: {type: String}
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


officeSchema.pre('save', function (next) {
    var office = this;
    // only hash the password if it has been modified (or is new)
    if (!office.isModified('name')) return next();

    var secondary = office.name;
    office.primary_key = md5(secondary);
    next();
});

// we need to create a model using it
var Office = mongoose.model('office', officeSchema);

module.exports = { 
    model: Office,

    create: function (params, result) {
        var officeInfo = new Office(params);

        var error = officeInfo.validateSync();

        if(error){
            result(error, null);
        }else{
            officeInfo.save(function (err) {
                if(err){
                    result(err, null);
                }else{
                    result(null, true);
                }
            });
        }
    },

    find: function (params, response) {
        Office.find( params , function (err, office) {
            if(err){
                response(err, null);
            }else{
                response(null, office);
            }
        });
    },

    findOne: function (params, response) {
        Office.findOne( params , function (err, office) {
            if(err){
                response(err, null);
            }else{
                response(null, office);
            }
        });
    },

    getAll: function (result) {
        Office
            .find({})
            .limit(10)
            .sort({ created_at: -1 })
            .exec(function (err, offices) {
                if(err){
                    result(err, null);
                }else{
                    result(null, offices);
                }
            })
    },

    update: function (id, params, result) {
        Office
            .findOneAndUpdate({_id: id}, params, {runValidators: false}, function (err) {
                if (err) {
                    result(err, null);
                } else {
                    result(null, true);
                }
            });
    },

    delete: function (id, result) {
        Office.deleteOne({_id: id}, function (err) {
            if (err) {
                result(err, null);
            } else {
                result(null, true);
            }
        });
    },
};