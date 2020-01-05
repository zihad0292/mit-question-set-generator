/**
 * Created by Rajesh on 7/2/19. Modified by Zihad Ul Islam Mahdi on 9/2/19. Changed session key to query key in solarStat function
 */

const url = require('url');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const request = require('request');

const configs = require('../configs');
const IndexStat = require('../models/indexStat');

module.exports = {

    createIndexStat: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        var indexStatRequest = {
            dbConfigId: ObjectId(query.db),
            indexRelationId: ObjectId(query.index)
        };

        IndexStat.create(indexStatRequest, function (err, result) {
            if(err){
                return next(err);
            }else {
                response.message = "New Database Successfully added";
            }

            res.json(response);
        });

    },

    statsList: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var response = {
            success : true,
            status  : 200
        };

        IndexStat.findByDbConfig(query.db, function (err, result) {
            if(err){
                return next(err);
            }else {
                response.results = result;
            }

            res.json(response);
        })
    },

    solarStat: function (req, res, next) {
        var sess = req.session;
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var resp = {
            success : true,
            status  : 200
        };
        const options = {
            url: configs.solrStatsApi + 'solr-stat?facet_field=search_index_name',
            method: 'GET',
            headers: {
                'api-key': query.key
            }
        };


        request(options, function (error, response, body) {
            if(error)
                return next(error);

            if(body) {
                try {
                    a = JSON.parse(body);
                    resp.results = a.result.solr_stat;
                } catch(e) {
                    console.log(e); // error in the above string (in this case, yes)!
                    resp.success = false;
                    resp.status = 501;
                    resp.message = "Response can not be parsed at this moment"
                }
            }

            res.json(resp);
        });
    }
};
