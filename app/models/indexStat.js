/**
 * Created by Rajesh on 7/2/19.
 */


var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var indexStatSchema = new Schema({
    className: {type: String, default: "com.pipilika.efile.entities.mongo.IndexStat"},
    dbConfigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DBConfig'
    },
    indexRelationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IndexRelation'
    },
    total: {type: Number, default: 0},
    success: {type: Number, default: 0},
    failed: {type: Number, default: 0},
},{
    collection: 'IndexStat',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// we need to create a model using it
var IndexStat = mongoose.model('IndexStat', indexStatSchema);

module.exports = {
    model: IndexStat,

    create: function (params, result) {
        var statInfo = new IndexStat(params);

        var error = statInfo.validateSync();

        if(error){
            result(error, null);
        }else{
            statInfo.save(function (err) {
                if(err){
                    result(err, null);
                }else{
                    result(null, true);
                }
            });
        }
    },

    findByDbConfig: function (dbConfig, response) {

        var dbId = mongoose.Types.ObjectId(dbConfig);

        IndexStat
            .find({dbConfigId: dbId})
            .populate('indexRelationId', { name: 1, crawling: 1, status: 1})
            .limit(10)
            .sort({ created_at: -1 })
            .exec(function (err, stats) {
                if(err){
                    response(err, null);
                }else{
                    response(null, stats);
                }
            });
    }
};