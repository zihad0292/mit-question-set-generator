/**
 * Created by Rajesh on 7/2/19.
 */

var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var dataFetchStatSchema = new Schema({
    className: {type: String, default: "com.pipilika.efile.entities.mongo.DataFetchStats"},
    dbConfigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DBConfig'
    },
    indexRelationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IndexRelation'
    },
    tableName: {type: String},
    total: {type: Number, default: 0}
},{
    collection: 'DataFetchStats',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// we need to create a model using it
var DBFetchStat = mongoose.model('DataFetchStats', dataFetchStatSchema);

module.exports = {
    model: DBFetchStat,

    findByDbConfig: function (dbConfig, offset, response) {

        var dbId = mongoose.Types.ObjectId(dbConfig);

        DBFetchStat
            .find({dbConfigId: dbId})
            .populate('indexRelationId', { name: 1, crawling: 1, status: 1})
            .skip(offset)
            .limit(10)
            .sort({ _id: -1})
            .exec(function (err, stats) {
                if(err){
                    response(err, null);
                }else{
                    response(null, stats);
                }
            });
    }
};