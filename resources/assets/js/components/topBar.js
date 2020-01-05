/**
 * Created by Rajesh on 5/29/19.
 */

import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToIcon from '@material-ui/icons/ExitToApp';

import {logOutUser} from '../actions/userActions';

const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
});

class TopBar extends Component{

    constructor(props){
        super(props);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    handleLogOut(){
        if(this.props.isLoggedIn){
            this.props.logOutUser();
        }
    }

    render(){
        const {classes, fetching, user, onToggleClick} = this.props;

        return(
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="Menu" disabled onClick={onToggleClick}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        E-File Admin Dashboard
                    </Typography>
                    <Button>{user ? user : 'no user found'}</Button>
                    <IconButton color="inherit" disabled={fetching} onClick={this.handleLogOut}><ExitToIcon/></IconButton>
                </Toolbar>
            </AppBar>
        )
    }
}

TopBar.propTypes = {
    onToggleClick: PropTypes.func
};

function mapStateToProps(store) {
    return {
        user        : store.userInfo.user,
        isLoggedIn  : store.userInfo.isLoggedIn,
        fetching    : store.userInfo.fetching
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ logOutUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TopBar));