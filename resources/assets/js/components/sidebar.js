/**
 * Created by Rajesh on 5/30/19. Modified by Zihad Ul Islam Mahdi on 9/17/19
 */
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const drawerWidth = 240;

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerPaper: {
        backgroundColor: '#fafafa',
        borderRight: '1px solid rgba(0, 0, 0, 0.05)'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    selectedItem: {
        backgroundColor: theme.palette.grey[300],
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    fontSize: {
      fontSize: '.8em!important'
    },
});

const Pages = [
    {
        title: 'Home',
        url: '/home',
        icon: 'home',
        type: 'admin'
    },
    {
        title: 'Office',
        url: '/office',
        icon: 'business',
        type: 'super-admin'
    },
    {
        title: 'Users',
        url: '/users',
        icon: 'supervised_user_circle',
        type: 'super-admin'
    },
    {
        title: 'Databases',
        url: '/database',
        icon: 'dns',
        type: 'admin'
    },
    {
        title: 'Index Relations',
        url: '/index_relation',
        icon: 'vertical_split',
        type: 'admin'
    },
    {
        id: 'statistics',
        title: 'Statistics',
        url: null,
        icon: 'bar_chart',
        type: 'admin',
        subitems: [{
            title: 'Crawler',
            url: '/stats/crawler',
            icon: 'bug_report',
            // inset: true,
            type: 'admin'
        },
        {
            title: 'Index',
            url: '/stats/indexes',
            icon: 'format_list_numbered',
            // inset: true,
            type: 'admin',
            only: true
        }]
    },
    {
        title: 'Search Index',
        url: '/search',
        icon: 'find_in_page',
        type: 'admin'
    },
    {
        id: 'data-types',
        title: 'Data types',
        url: null,
        icon: 'perm_data_setting_icon',
        type: 'admin',
        subitems: [{
            title: 'All',
            url: '/data-types/all',
            icon: 'dns',
            type: 'admin'
        },
        {
            title: 'Credentials',
            url: '/data-types/credentials',
            icon: 'vpn_key',
            type: 'admin'
        }]
    }
];

class Sidebar extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataTypesOpen: false,
            statOpen: false
        };

        this.handleSubpageClick = this.handleSubpageClick.bind(this);
        this.retrievePageSpecificState = this.retrievePageSpecificState.bind(this);
        this.onLinkClick = this.onLinkClick.bind(this);
    }

    onLinkClick(url){
        this.props.history.push('/dashboard' + url + "/");
    }

    handleSubpageClick(pageId) {
        if(pageId === 'statistics'){
            this.setState({
                statOpen: !this.state.statOpen
            });
        }else{
            this.setState({
                dataTypesOpen: !this.state.dataTypesOpen
            });
        }
    }

    retrievePageSpecificState(pageId){
        if(pageId === 'statistics'){
            return this.state.statOpen;
        }else{
            return this.state.dataTypesOpen;
        }
    }

    render(){
        const {classes, isOpen, type} = this.props;
        const currentPath = this.props.location.pathname;

        const menuItem = Pages
            .filter((item)=>{
                if(type == "super-admin"){
                    if(!item.only) return item;
                }else if(item.type == 'admin'){
                    return item;
                }
            })
            .map((page, index) => {
                return  page.subitems != null ?  
                (
                    <React.Fragment key={index}>
                        <ListItem button onClick={(e)=>this.handleSubpageClick(page.id)}>
                            <ListItemIcon><Icon>{page.icon}</Icon></ListItemIcon>
                            <ListItemText inset={page.inset} primary={page.title} />
                            {this.retrievePageSpecificState(page.id) ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.retrievePageSpecificState(page.id)} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {page.subitems.map((subpage, idx) => {
                                    return (
                                        <ListItem button key={'hello'+ idx} link={subpage.url}
                                        className={`${classes.nested} ${currentPath.includes(subpage.url) ? classes.selectedItem : ''}`}
                                        onClick={(e) => {subpage.url ? this.onLinkClick(subpage.url) : null}}>
                                    {subpage.icon &&
                                            <ListItemIcon><Icon>{subpage.icon}</Icon></ListItemIcon>
                                        }
                                            <ListItemText primary={subpage.title} className={classes.fontSize}/>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Collapse>
                    </React.Fragment>
                ) :
                (
                    <ListItem button key={index} link={page.url}
                              className={currentPath.includes(page.url) ? classes.selectedItem : ''}
                              onClick={(e) => {page.url ? this.onLinkClick(page.url) : null}}>
                        {page.icon &&
                            <ListItemIcon><Icon>{page.icon}</Icon></ListItemIcon>
                        }
                        <ListItemText inset={page.inset} primary={page.title} />
                    </ListItem>
                );
            });

        return(
            <Drawer variant="permanent"
                    className={`${classes.drawer} ${isOpen ? classes.drawerOpen : classes.drawerClose}`}
                    classes={{paper: `${isOpen ? classes.drawerOpen : classes.drawerClose} ${classes.drawerPaper}`}}>
                <div className={classes.toolbar}/>
                <List>
                    {menuItem}
                </List>
            </Drawer>
        );
    }
}

Sidebar.propTypes = {
    isOpen: PropTypes.bool
};

function mapStateToProps(store) {
    return {
        user        : store.userInfo.user,
        isLoggedIn  : store.userInfo.isLoggedIn,
        type        : store.userInfo.type
    };
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Sidebar)));