/**
 * Created by Rajesh on 11/13/18. Modified by Zihad Ul Islam Mahdi on 9/3/19.
 */

import { combineReducers } from "redux";
import { routerReducer } from 'react-router-redux';

import userInfo from './userReducer';
import officeInfo from './officeReducer';
import dbConfigInfo from './dbConfigReducer';
import indexRelationInfo from './indexRelationReducer';
import userListInfo from './usersListReducer';
import statsInfo from './statsReducer';
import crawlerStatsInfo from './crawlerStatsReducer';
import indexSearchInfo from './indexSearchReducer';
import dataTypesInfo from './dataTypesReducer';
import credentialsInfo from './credentialReducer';

export default combineReducers({
    userInfo,
    officeInfo,
    dbConfigInfo,
    indexRelationInfo,
    userListInfo,
    statsInfo,
    crawlerStatsInfo,
    indexSearchInfo,
    dataTypesInfo,
    credentialsInfo,
    routing: routerReducer
});
