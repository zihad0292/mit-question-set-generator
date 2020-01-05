/**
 * Created by Rajesh on 5/29/19.
 */

import React, {Component} from 'react';
import {render} from 'react-dom';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class PrivateRoute extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {isAuthenticated, component: Component, ...rest} = this.props;

        return(
            <Route {...rest} render={(props) => (
                isAuthenticated === true
                 ? <Component {...props} />
                 : <Redirect to='/login' />
            )}/>
        )
    }
}

export default connect((store) => ({isAuthenticated: store.userInfo.isLoggedIn}))(PrivateRoute);