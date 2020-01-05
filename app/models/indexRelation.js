/**
 * Created by Rajesh on 5/14/19. Modified by Zihad Ul Islam Mahdi on 8/29/19.
 */

var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var columnSchema = new Schema({
    name: {type: String},
    type: {type: String},
    field: {type: String},
    credential : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Credentials'
    },
});

var fieldInformationSchema = new Schema({
    tableName        : {type: String, required: [true, "Table Name on Field Information Can't be empty"]},
    fieldName        : {type: String, required: [true, "Field Name on Field Information Can't be empty"]},
    type             : {type: String, required: [true, "Type on Field Information Can't be empty"]},
    ftpInformationId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Credentials'
    },
});

var relationSchema = new Schema({
    primary: {type: String},
    secondary: {type: String}
});

var indexTablesSchema = new Schema({
    table: {type: String, required: [true, "Index Table name Can't be empty"]},
    secondary: {type: String},
    relation: {type: relationSchema},
    columns: [columnSchema]
});

var indexRelationSchema = new Schema({
    className        : {type: String, default: "com.pipilika.efile.entities.mongo.IndexRelation"},
    dbConfigId       : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'DBConfig'
    },
    name             : {type: String, unique: true, required: [true, "Index Relation Name Cannot be Empty"]},
    query            : {type: String, required: [true, "Index Relation Query Cannot be Empty"]},
    indexTables      : [indexTablesSchema],
    fieldInformations: [fieldInformationSchema],
    enable           : {type: Boolean, default: true},
    frequency        : {type: Number, default: 1},
    crawling         : {type: Boolean, default: false},
    status           : {type: String, default: "START"},
    lastCrawledAt    : {type: Date}
},{
    collection: 'IndexRelation',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

indexRelationSchema.pre('save', function (next) {
    var index = this;

    // only hash the password if it has been modified (or is new)
    if (!index.isModified('indexTables')) return next();
    var fieldInfo = [];

    index.indexTables.forEach(function(tables){
        tables.columns.forEach(function (column) {
            var field = {
                tableName       : tables.table,
                fieldName       : column.name,
                type            : (column.field === 'FTP' || column.field === 'SFTP') ? 'MEDIA' : (column.field ? column.field: 'plain'),
                ftpInformationId: column.credential ? column.credential: null,
            };
            fieldInfo.push(field);
        })
    });

    index.fieldInformations = fieldInfo;

    next();
});

indexRelationSchema.pre('findOneAndUpdate', function (next) {
    var index = this._update;

    var fieldInfo = [];

    index.indexTables.forEach(function(tables){
        tables.columns.forEach(function (column) {
            var field = {
                tableName : tables.table,
                fieldName : column.name,
                type      : column.field ? column.field.toUpperCase() : 'PLAIN',
                credential: column.credential ? mongoose.Types.ObjectId(column.credential) : undefined
            };
            fieldInfo.push(field);
        })
    });

    index.fieldInformations = fieldInfo;

    next();
});

var IndexRelation = mongoose.model('IndexRelation', indexRelationSchema);

module.exports = {
    model: IndexRelation,

    create: function (params, result) {
        var index = new IndexRelation(params);

        var error = index.validateSync();

        if(error){
            result(error, null);
        }else{
            index.save(function (err) {
                if(err){
                    result(err, null);
                }else{
                    result(null, true);
                }
            });
        }
    },

    find: function (params, response) {
        IndexRelation.find( params , function (err, indexRelation) {
            if(err){
                response(err, null);
            }else{
                response(null, indexRelation);
            }
        });
    },
    
    get: function (result) {
        IndexRelation
            .find({})
            .limit(30)
            .sort({ created_at: -1 })
            .exec(function (err, dbList) {
                if(err){
                    result(err, null);
                }else{
                    result(null, dbList);
                }
            });
    },

    getByDbConfig: function (dbConfig, result) {
        IndexRelation
            .find({dbConfigId: dbConfig})
            .sort({ created_at: -1 })
            .limit(200)
            .select({ _id: 1, enable: 1, dbConfigId: 1, name: 1, lastCrawledAt: 1})
            .exec(function (err, dbList) {
                if(err){
                    result(err, null);
                }else{
                    result(null, dbList);
                }
            });
    },

    update: function (id, params, result) {
        IndexRelation
            .findOneAndUpdate({_id: id}, params, {runValidators: true}, function (err) {
                if(err){
                    result(err, null);
                }else{
                    result(null, true);
                }
            })
    },
    
    delete: function (id, result) {
        IndexRelation
            .deleteOne({_id: id}, function (err) {
                if (err) {
                    result(err, null);
                } else {
                    result(null, true);
                }
            });
    },

    deleteMany: function (id) {
        IndexRelation.deleteMany({dbConfigId: id}, function (err) {
            if (err) {
                console.log("Error Deleting IndexRelations");
            } else{
                console.log("IndexRelations");
            }
        });
    },
};