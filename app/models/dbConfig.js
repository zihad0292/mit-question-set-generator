/**
 * Created by Rajesh on 5/14/19. Modified by Zihad Ul Islam Mahdi on 9/1/19. Added deletemany() and Added indexrelation delete when db is deleted
 */

var mongoose = require('mongoose');
var IndexRelation = require('../models/indexRelation');
var Schema =  mongoose.Schema;

var dbConfigSchema = new Schema({
    className     : {type: String, default: "com.pipilika.efile.entities.mongo.DBConfig"},
    name          : {type: String, unique: true, required: [true, "A Unique Configuration name must be added"]},
    dbName        : {type: String, trim: true, required: [true, 'Database Name cannot be empty']},
    host          : {type: String, trim: true, required: [true, 'Database Host cannot be empty']},
    port          : {type: Number, default: 27017},
    user          : {type: String, required: [true, 'Database User Credential Can not be empty']},
    password      : {type: String, required: [true, 'Database Password is required to access DB']},
    token         : {type: String, required: [true, 'Primary Token is Required']},
    enable        : {type: Boolean, default: true},
    frequency     : {type: Number, default: 10},
    crawling      : {type: Boolean, default: false},
    status        : {type: String, default: 'START'},
    lastCrawledAt : {type: Date}
},{
    collection: 'DBConfig',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

dbConfigSchema.pre('deleteOne', function (next) {
    IndexRelation.deleteMany(this._conditions._id);
    next();
});


var DBConfig = mongoose.model('DBConfig', dbConfigSchema);

module.exports = {
    create: function (params, result) {
        var dbInfo = new DBConfig(params);

        var error = dbInfo.validateSync();

        if(error){
            result(error, null);
        }else{
            dbInfo.save(function (err) {
                if(err){
                    result(err, null);
                }else{
                    result(null, true);
                }
            });
        }
    },

    getAll: function (token=null, result) {

        var params = {};

        if(token) params.token = token;

        DBConfig
            .find(params)
            .limit(250)
            .sort({ created_at: -1 })
            .select({
                _id: 1,
                port: 1,
                enable: 1,
                frequency: 1,
                crawling: 1,
                status: 1,
                name: 1,
                host: 1,
                dbName: 1,
                user: 1,
                password: 1,
                token: 1
            })
            .exec(function (err, dbList) {
                if(err){
                    result(err, null);
                }else{
                    result(null, dbList);
                }
            });
    },

    find: function (params, response) {
        DBConfig.find( params , function (err, dbconfig) {
            if(err){
                response(err, null);
            }else{
                response(null, dbconfig);
            }
        });
    },

    findOnlyId: function (params, response) {
        DBConfig.find( params).select("_id").exec(function (err, dbconfig) {
            if(err){
                response(err, null);
            }else{
                response(null, dbconfig);
            }
        });
    },

    update: function (id, params, result) {
        DBConfig
            .findOneAndUpdate({_id: id}, params, {runValidators: true}, function (err) {
                if (err) {
                    result(err, null);
                } else {
                    result(null, true);
                }
            });
    },

    delete: function (id, result) {
        DBConfig
            .deleteOne({_id: id}, function (err) {
                if (err) {
                    result(err, null);
                } else {
                    result(null, true);
                }
            });
    },

    deleteMany: function (id) {
        DBConfig.deleteMany({token: id}, function (err) {
            if (err) {
                console.log("Error Deleting Databases");
            } 
        });
    },
};