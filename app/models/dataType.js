/**
 * Created by rajesh on 7/18/19. Modified by Zihad Ul Islam Mahdi on 9/5/19
 */


var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var dataTypeSchema = new Schema({
    dataType: {type: String, required: [true, "Data Type Name Can't be empty"]},
    enabled: {type: Boolean, default: true},
    hasCredentials: {type: Boolean, default: false},
},{
    collection: 'DataTypes',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var dataType = mongoose.model('dataType', dataTypeSchema);



var fileCredSchema = new Schema({
    protocol: {type: String, required: [true, "Protocol Type Name Can't be empty"]},
    username: {type: String},
    password: {type: String},
    port:     {type: String},
    key:      {type: String}
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var fileCred = mongoose.model('fileCred', fileCredSchema);



var encryptionCredSchema = new Schema({
    title: {type: String, required: [true, "Encryption title Can't be empty"]}
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var encryptionCred = mongoose.model('encryptionCred', encryptionCredSchema);



module.exports = {
    model: dataType,

    create: function (params, result) {
        var dataTypeInfo = new dataType(params);

        var error = dataTypeInfo.validateSync();

        if(error){
            result(error, null);
        }else{
            dataTypeInfo.save(function (err) {
                if(err){
                    result(err, null);
                }else{
                    result(null, true);
                }
            });
        }
    },

    getAll: function (showAll, result) {

        dataType
            .find({})
            .exec(function (err, types) {
                if(err){
                    result(err, null);
                }else{
                    result(null, types);
                }
            });
    },

    update: function (id, params, result) {
        dataType
            .findOneAndUpdate({_id: id}, params, {runValidators: false}, function (err) {
                if (err) {
                    result(err, null);
                } else {
                    result(null, true);
                }
            });
    },

    delete: function (id, result) {
        dataType.deleteOne({_id: id}, function (err) {
            if (err) {
                result(err, null);
            } else {
                result(null, true);
            }
        });
    },
};