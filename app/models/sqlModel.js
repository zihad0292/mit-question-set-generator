/**
 * Created by Rajesh on 5/15/19.
 */

var cluster = require('../sqlpool');

module.exports = {
        performQuery: function (clusterID, db, queryStr, result) {
            cluster.pool.getConnection(clusterID, function (error, connection) {
                if (error) {
                    result(error, null);
                } else {
                    queryToSql(connection, queryStr, result);
                }
            });
        },

        getTables: function (clusterID, db, result) {

            cluster.pool.getConnection(clusterID, function (error, connection) {
                if(error){
                    result(error, null);
                }else{
                    var query = "SELECT table_name FROM information_schema.tables where table_schema='" + db + "'";
                    queryToSql(connection, query, result);
                }
            });
        },

        getColumns: function (clusterID, db, tableName, result) {

            cluster.pool.getConnection(clusterID, function (error, connection) {
                if (error) {
                    result(error, null);
                } else {
                    var query = "SELECT `COLUMN_NAME`, `COLUMN_TYPE` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='" + db + "' AND `TABLE_NAME`='" + tableName + "'";
                    queryToSql(connection, query, result);
                }
            });

        }
};

function queryToSql(conn, query, response) {
    conn.query(query, function (err, res) {
        conn.release();

        if (err) {
            response(err, null);
        } else {
            response(null, res);
        }
    });
}
