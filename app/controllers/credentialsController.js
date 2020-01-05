/**
 * Created by Zihad Ul Islam Mahdi on 9/8/19.
 */
var url = require('url');
var Credential = require('../models/credentials');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = {
    createCredential: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var dbRequest = {};
        if(query.type == 'encryption'){
            dbRequest = {
                dataType          : query.selectedDataType,
                credentialName    : query.n,
                dataTypeId        : ObjectId(decodeURIComponent(query.selectedDataTypeId)),
                enable            : query.e,
            };  
        }else if(query.type == 'ftp'){
            dbRequest = {
                dataType          : query.selectedDataType,
                credentialName    : query.name,
                dataTypeId        : ObjectId(decodeURIComponent(query.selectedDataTypeId)),
                host              : query.server,
                port              : query.port,
                user              : query.user,
                password          : query.pass,
                enable            : query.enable,
                homeDirectory     : query.homeDirectory ? query.homeDirectory : null,
                protocol          : query.selectedDataType,
            };            
        }else{
            dbRequest = {
                dataType          : query.selectedDataType,
                credentialName    : query.name,
                dataTypeId        : ObjectId(decodeURIComponent(query.selectedDataTypeId)),
                host              : query.server,
                port              : query.port,
                enable            : query.enable,
                user              : query.user,
                key               : query.sftpKey,
                fileName          : query.sftpFileName,
                homeDirectory     : query.homeDirectory ? query.homeDirectory : null,
                protocol          : query.selectedDataType,
            };            
        }
        
        var response = {
            success : true,
            status  : 200
        };
        
        Credential.create(dbRequest, function (err, result) {
            if(err){
                //next(err);
                response.success = false;
                response.status = 401;
                response.error = err;
            }else {
                response.message = "New Credential Successfully added";
            }

            res.json(response);
        });
    },

    credentialList: function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var cb = function (err, result) {
            if (err) {
                response.success = false;
                response.status = 401;
                response.error = err;
            } else {
                response.results = result;
            }
            res.json(response);
        };

        if(query.type){
            Credential.find({dataType: query.type}, cb);
        }else{
            Credential.getAll(cb);
        }
    },

    updateCredential: function (req, res, next) {

        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var dbRequest = {};
        
        if(query.type == 'encryption'){
            dbRequest = {
                dataType          : query.selectedDataType,
                credentialName    : query.n,
                dataTypeId        : ObjectId(decodeURIComponent(query.selectedDataTypeId)),
                enable            : query.e,
            };  
        }else if(query.type == 'ftp'){
            dbRequest = {
                dataType          : query.selectedDataType,
                credentialName    : query.name,
                dataTypeId        : ObjectId(decodeURIComponent(query.selectedDataTypeId)),
                host              : query.server,
                port              : query.port,
                user              : query.user,
                password          : query.pass,
                enable            : query.enable,
                homeDirectory     : query.homeDirectory ? query.homeDirectory : null,
                protocol          : query.selectedDataType,
            };            
        }else{
            dbRequest = {
                dataType          : query.selectedDataType,
                credentialName    : query.name,
                dataTypeId        : ObjectId(decodeURIComponent(query.selectedDataTypeId)),
                host              : query.server,
                port              : query.port,
                enable            : query.enable,
                user              : query.user,
                key               : query.sftpKey,
                fileName          : query.sftpFileName,
                homeDirectory     : query.homeDirectory ? query.homeDirectory : null,
                protocol          : query.selectedDataType,
            };            
        }
        
        Credential.update(query.id, dbRequest, function (err, success) {
            if(err){
                return next(err);
            }else{
                response.message = "Credential Successfully updated";
                res.json(response);
            }
        })
    },

    deleteCredential: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        Credential.delete(query.id, function (err, success) {
            if(err){
                return next(err);
            }else{
                response.message = "Credential Successfully deleted";
                res.json(response);
            }
        })
    }
};
