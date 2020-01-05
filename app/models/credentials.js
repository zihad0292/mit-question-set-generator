/**
 * Created by Zihad Ul Islam Mahdi on 9/5/19.
 */
var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var credentialSchema = new Schema({
    dataType          : {type: String},
    credentialName    : {type: String},
    dataTypeId        : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataTypes'
    },
    host            : {type: String},
    port              : {type: Number},
    user              : {type: String},
    password          : {type: String},
    enable            : {type: Boolean, default: false},
    key               : {type: String},
    fileName          : {type: String},
    homeDirectory     : {type: String},
    protocol          : {type: String},
},{
    collection: 'FtpInformation',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});



var Credential = mongoose.model('Credential', credentialSchema);

module.exports = {
    create: function (params, result) {
        var credentialInfo = new Credential(params);

        var error = credentialInfo.validateSync();

        if(error){
            result(error, null);
        }else{
            credentialInfo.save(function (err) {
                if(err){
                    result(err, null);
                }else{
                    result(null, true);
                }
            });
        }
    },

    getAll: function (result) {
        Credential
            .find({})
            .limit(250)
            .sort({ created_at: -1 })
            .exec(function (err, credentialList) {
                if(err){
                    result(err, null);
                }else{
                    result(null, credentialList);
                }
            });
    },

    find: function (params, response) {
        Credential.find( params , function (err, credential) {
            if(err){
                response(err, null);
            }else{
                response(null, credential);
            }
        });
    },

    findOnlyId: function (params, response) {
        Credential.find( params).select("_id").exec(function (err, credential) {
            if(err){
                response(err, null);
            }else{
                response(null, credential);
            }
        });
    },

    update: function (id, params, result) {
        Credential
            .findOneAndUpdate({_id: id}, params, {runValidators: true}, function (err) {
                if (err) {
                    result(err, null);
                } else {
                    result(null, true);
                }
            });
    },

    delete: function (id, result) {
        Credential
            .deleteOne({_id: id}, function (err) {
                if (err) {
                    result(err, null);
                } else {
                    result(null, true);
                }
            });
    },

    deleteMany: function (id) {
        Credential.deleteMany({token: id}, function (err) {
            if (err) {
                console.log("Error Deleting Credential");
            } 
        });
    },
};