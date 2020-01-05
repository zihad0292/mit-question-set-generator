/**
 * Created by Rajesh on 7/16/19.
 */

const url = require('url');
const request = require('request');

const configs = require('../configs');

module.exports = {
    searchToApiByQuery: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var sess = req.session;

        var resp = {
            success : true,
            status  : 200
        };

        var requestStr = `${configs.solrStatsApi}search?searchIndexNo=${query.index}&offset=0&total=10&query=${encodeURI(query.q)}`;

        const options = {
            url: requestStr,
            method: 'GET',
            headers: {
                'api-key': sess.key
            }
        };

        request(options, function (error, response, body) {
            if(error)
                return next(error);

            if(body) {
                try {
                    a = JSON.parse(body);
                    if(a.code == 200){
                        resp.results = a.result;
                    }else{
                        resp.success = false;
                        resp.status = a.code;
                        resp.message = a.message;
                    }
                } catch(e) {
                    console.log(e); // error in the above string (in this case, yes)!
                    resp.success = false;
                    resp.status = 501;
                    resp.message = "Response can not be parsed at this moment"
                }
            }
            res.json(resp);
        });
    },

    searchToApiByParam: function (req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var sess = req.session;

        var resp = {
            success : true,
            status  : 200
        };

        var params = JSON.parse(query.p);
        var urlString = configs.solrStatsApi + 'search?searchIndexNo=' + query.index;

        Object.keys(params).map(function (param) {
            urlString += '&' + param + "=" + params[param];
        });

        const options = {
            url: urlString,
            method: 'GET',
            headers: {
                'api-key': sess.key
            }
        };

        request(options, function (error, response, body) {
            if(error)
                return next(error);

            if(body) {
                try {
                    a = JSON.parse(body);
                    if(a.code == 200){
                        resp.results = a.result;
                    }else{
                        resp.success = false;
                        resp.status = a.code;
                        resp.message = a.message;
                    }
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
