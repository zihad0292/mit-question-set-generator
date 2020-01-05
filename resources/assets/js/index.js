/**
 * Created by Rajesh on 11/26/18.
 */

import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import '../sass/app.scss';
import store from './store';
import Dashboard from './layout';
import Login from './pages/login';
import NotFound from './pages/notfound';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#b388ff',
            main: '#7c4dff',
            dark: '#651fff'
        },
        secondary: {
            main: '#43a047',
        },
    },
    shape: {
        borderRadius: 8
    },
    typography: {
        fontFamily: [
            '"Helvetica 65 Medium"',
            '"Helvetica Neue"',
            '-apple-system',
            'BlinkMacSystemFont',
            'Arial',
            'sans-serif'
        ].join(','),
    },
});

let Root = ({store}) => (
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/login" component={Login} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired
};

render(
    <MuiThemeProvider theme={theme}>
        <Root store={store}/>
    </MuiThemeProvider>,
    document.getElementById('app')
);
