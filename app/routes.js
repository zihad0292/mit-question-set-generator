/**
 * Created by talha on 5/15/19. Modified by Zihad Ul Islam Mahdi on 9/3/19.
 */

require('dotenv').config();
var express = require('express');
var middleware = require('./middlewares');

var routes = express.Router();


var tableController = require('./controllers/tableController');
var authController = require('./controllers/authController');
var officeController = require('./controllers/officeController');
var dbConfigController = require('./controllers/dbConfigController');
var indexRelationController = require('./controllers/indexRelationController');
var dataTypeController = require('./controllers/dataTypeController');
var userController = require('./controllers/userController');
var indexStatController = require('./controllers/indexStatsController');
var fetchStatsController = require('./controllers/fetchStatsController');
var indexSearchController = require('./controllers/indexSearchController');
var credentialsController = require('./controllers/credentialsController');

routes.use(middleware.fakeDelay);

routes.get('/login', authController.authenticate);
routes.get('/login/session', authController.getSessionInfo);
routes.get('/login/logout', authController.destroySession);

routes.post('/connection/create', tableController.establishConnection);
routes.post('/connection/check', tableController.checkConnection);

routes.get('/tables/list', tableController.getTableList);
routes.get('/tables/columns', tableController.getColumnList);
routes.get('/tables/query', tableController.getQueryResponse);

routes.get('/data-types/list', dataTypeController.getAllTypes);
routes.post('/data-types/new', dataTypeController.createDataType);
routes.post('/data-types/update', dataTypeController.updateDataType);
routes.delete('/data-types/delete', dataTypeController.deleteDataType);

routes.get('/office/list', officeController.officeList);
routes.post('/office/new', officeController.createOffice);
routes.post('/office/update', officeController.updateOffice);
routes.delete('/office/delete', officeController.deleteOffice);

routes.put('/dbconfig/new', dbConfigController.createDb);
routes.get('/dbconfig/list', dbConfigController.dbConfigList);
routes.post('/dbconfig/update', dbConfigController.updateDbConfig);
routes.delete('/dbconfig/delete', dbConfigController.deleteDBConfig);

routes.put('/credentials/new', credentialsController.createCredential);
routes.get('/credentials/list', credentialsController.credentialList);
routes.post('/credentials/update', credentialsController.updateCredential);
routes.delete('/credentials/delete', credentialsController.deleteCredential);

routes.put('/index/new', indexRelationController.createIndex);
routes.get('/index/list', indexRelationController.indexRelationList);
routes.get('/index/count', indexRelationController.countIndex);
routes.get('/index/find', indexRelationController.findIndex);
routes.post('/index/update', indexRelationController.updateIndex);
routes.delete('/index/delete', indexRelationController.deleteIndex);

routes.put('/user/new', userController.createUser);
routes.get('/user/list', userController.usersList);
routes.post('/user/update', userController.updateUser);
routes.delete('/user/delete', userController.deleteUser);

routes.put('/stats/index/create', indexStatController.createIndexStat);
routes.get('/stats/index/list', indexStatController.solarStat);
routes.get('/stats/crawler/list', fetchStatsController.statsList);

routes.get('/index-search/query', indexSearchController.searchToApiByQuery);
routes.get('/index-search/params', indexSearchController.searchToApiByParam);
module.exports = routes;