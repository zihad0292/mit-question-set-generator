/**
 * Created by Rajesh on 6/12/19.
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {fetchDBConfigList, setDBConfigToken} from '../../actions/dbConfigActions';
import {fetchOfficeList} from '../../actions/officeActions';
import {fetchIndexRelationCount} from '../../actions/userActions';
import {PageContainer, CustomSmallPaper, WidgetTitle} from '../../components/utils';

const styles = theme => ({
    media: {
        height: '100%'
    },
    homeWidget: {
        height: 500
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        marginBottom: theme.spacing(5)
    },
    titleStyle: {
        fontSize: '2.3rem',
        textTransform: 'uppercase',
        marginBottom: theme.spacing(5)
    },
    smallWidgetStyle: {
        height: 250 - theme.spacing(1),
        overflow: 'hidden'
    },
    statTitleStyle: {
        fontSize: '3.5rem',
        marginBottom: theme.spacing(0.5)
    }
});

class Landing extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        const {offices, dbConfigs, totalIndex, type, office_id, fetchOfficeList} = this.props;

        if(dbConfigs.length == 0 && type !== 'admin') {
            this.props.fetchDBConfigList();
        }

        if(offices.length == 0){
            if(type == 'admin') {
                fetchOfficeList(office_id);
            }else{
                fetchOfficeList();
            }
        }

        if(dbConfigs.length > 0 && totalIndex == 0){
            let dbConfigList = dbConfigs.map((config) => config._id);
            this.props.fetchIndexRelationCount(dbConfigList);
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.offices.length == 0 && nextProps.offices.length > 0) {
            if(nextProps.type == 'admin'){
                const token = nextProps.offices[0].primary_key;
                this.props.setDBConfigToken(token);
            }
        }

        if(this.props.token != nextProps.token && this.props.type == 'admin'){
            this.props.fetchDBConfigList(nextProps.token);
        }

        if(this.props.dbConfigs.length != nextProps.dbConfigs.length){
            let dbConfigList = nextProps.dbConfigs.map((config) => config._id);
            this.props.fetchIndexRelationCount(dbConfigList);
        }
    }

    render(){
        const {classes, user, userKey, dbConfigs, totalIndex, history} = this.props;

        return(
            <PageContainer maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <CustomSmallPaper className={classes.homeWidget}>
                            <CardMedia
                                className={classes.media}
                                image="/images/welcome.png"
                                title="welcome"
                            />
                            <CardContent className={classes.cardContent}>
                                <WidgetTitle color="primary" className={classes.titleStyle}>
                                    Welcome
                                </WidgetTitle>
                                <Typography variant="subtitle1">{user}</Typography>
                                <Typography variant="subtitle2">API-KEY: {userKey}</Typography>
                            </CardContent>
                        </CustomSmallPaper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <CustomSmallPaper className={classes.smallWidgetStyle}>
                                    <Grid container direction="column"
                                          justify="center" alignItems="center"
                                          style={{height:'100%'}}>
                                        <WidgetTitle color="primary" className={classes.statTitleStyle} align="center">
                                            {dbConfigs.length}
                                        </WidgetTitle>
                                        <WidgetTitle small align="center">
                                            Database Configs
                                        </WidgetTitle>
                                        <Button variant="outlined"
                                                onClick={() => {
                                                    history.push('/dashboard/database/');
                                                }}>
                                            View More
                                        </Button>
                                    </Grid>
                                </CustomSmallPaper>
                            </Grid>
                            <Grid item>
                                <CustomSmallPaper className={classes.smallWidgetStyle}>
                                    <Grid container direction="column"
                                          justify="center" alignItems="center"
                                          style={{height:'100%'}}>
                                        <WidgetTitle color="primary" className={classes.statTitleStyle} align="center">
                                            {totalIndex}
                                        </WidgetTitle>
                                        <WidgetTitle small align="center">
                                            Total Index Relation
                                        </WidgetTitle>
                                        <Button variant="outlined"
                                                onClick={() => {
                                                    history.push('/dashboard/index_relation/');
                                                }}>
                                            View More
                                        </Button>
                                    </Grid>
                                </CustomSmallPaper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </PageContainer>
        )
    }

}

function mapStateToProps(store) {
    return {
        ...store.userInfo,
        offices: store.officeInfo.offices,
        dbConfigs: store.dbConfigInfo.dbConfigs,
        token: store.dbConfigInfo.token
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchDBConfigList, setDBConfigToken, fetchOfficeList, fetchIndexRelationCount}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Landing)));