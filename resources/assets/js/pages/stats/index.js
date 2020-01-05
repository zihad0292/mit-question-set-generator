/**
 * Created by Rajesh on 7/2/19. Modified by Zihad Ul Islam Mahdi on 9/2/19
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import MaterialTable, {MTableToolbar} from 'material-table';

import {fetchOfficeList} from '../../actions/officeActions';
import {fetchIndexStats} from '../../actions/statsActions';
import {PageContainer, WidgetTitle, FullBodyLoader, CustomSmallPaper} from '../../components/utils';
import IntegrationReactSelect from '../../components/IntegrationReactSelect';
import {fetchUserList} from '../../actions/usersListActions';


Object.size = function(obj) {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


const styles = theme => ({
    tableTitle: {
        margin: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    relativeContainer: {
        position: 'relative'
    },
    media: {
        height: 260
    },
    title:{
        position: 'absolute',
        bottom: 125,
        padding: theme.spacing(2),
        width: '60%',
        color: theme.palette.primary.dark
    },
    dbCardRow: {
        padding: theme.spacing(1),
        margin: theme.spacing(1, 0)
    },
    dbRowImage: {
      width: 40
    },
    cardContent: {
        height: 120,
        overflow: 'hidden'
    },
    enableText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    enableIcon: {
        position: 'relative',
        top: -1,
        marginRight: theme.spacing(0.5)
    },
    cardButton: {
        margin: theme.spacing(0.5)
    },
    toolbarStyle: {
        backgroundImage: "url('/images/index-relation-banner.png')",
        minHeight: 140,
        backgroundSize: 'cover'
    },
    bottomSpace: {
        marginBottom: theme.spacing(2)
    },
});

class Stats extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedOffice: null,
        }
        this.onOfficeSelect = this.onOfficeSelect.bind(this);
        this.onUserSelect = this.onUserSelect.bind(this);
    }

    componentDidMount(){
        const {offices, userType, indexStats, fetchOfficeList, fetchIndexStats, office, userKey} = this.props;

        if(offices.length == 0){
            if(userType == 'admin') {
                fetchOfficeList(office);
            }else{
                fetchOfficeList();
            }
        }

        if(Object.size(indexStats) == 0){
            fetchIndexStats(userKey);
        }
    }

    onOfficeSelect(val){
        var officeId = val.value;
        this.props.fetchUserList(officeId);
    }

    onUserSelect(val){
        var key = val.value;
        this.props.fetchIndexStats(key);
    }

    renderIndexStatsTable(indexStat){

        var resultArray = Object.keys(indexStat).map(function(key) {
            return {"name": key, "indexstatCount": indexStat[key]};
        });

        const {offices, classes} = this.props;

        const columns = [
            {
                title: 'Name', field: 'name', sorting: false
            },
            {
                title: 'Total Indexed', field: 'indexstatCount', sorting: false
            }
        ];

        const components = {
            Toolbar: props => (
                <div className={classes.toolbarStyle}>
                    <MTableToolbar {...props} />
                </div>
            ),
            Container: props => {
                return(
                    <CustomSmallPaper style={props.style}>{props.children}</CustomSmallPaper>
                )
            }
        };

        const options= {
            showTitle: false,
            actionsColumnIndex: -1,
            searchFieldStyle: {
                color: "#fff"
            }
        };

        return(
            <MaterialTable
                title="Index Relations Stats"
                columns={columns}
                data={resultArray}
                options={options}
                components={components}
                style={{overflow: 'hidden'}}
            />
        );

    }

    render(){
        const {classes, indexStats, fetching, offices, userType, users} = this.props;
        
        let officeList = offices.map(office => {
            return {
                value: office._id,
                label: office.name,
            };
        });

        let userList = users.map(user => {
            return {
                value: user.secondary_key,
                label: user.email,
            };
        });

        let selectOfficeUserMarkup = '';
        let selectUserMarkup = '';

        if(userList.length > 0){
            selectUserMarkup = 
            <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                <Grid item xs={3}>
                    <Typography variant="subtitle1" component="p">
                        Select User
                    </Typography>
                </Grid>
                <Grid item xs={9}>
                    <IntegrationReactSelect suggestions={userList}
                                            onChange={this.onUserSelect}
                                            label="User List" disabled={fetching}/>
                </Grid>
            </Grid>
        }

        if(userType == "super-admin"){
            selectOfficeUserMarkup = <Grid container spacing={2}>
            <Grid item xs={12} sm={8} className={`${classes.relativeContainer} ${classes.bottomSpace}`}>
                <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                    <Grid item xs={3}>
                        <Typography variant="subtitle1" component="p">
                            Select Office
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <IntegrationReactSelect suggestions={officeList}
                                                onChange={this.onOfficeSelect}
                                                label="Office List" disabled={fetching}/>
                    </Grid>
                </Grid>
                {selectUserMarkup}
            </Grid>
        </Grid>
        }
        return(
            <PageContainer maxWidth="lg">
                {selectOfficeUserMarkup}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8} className={classes.relativeContainer}>
                        <WidgetTitle>
                            Index Relations Stats
                        </WidgetTitle>
                        {this.renderIndexStatsTable(indexStats)}
                        <FullBodyLoader active={fetching}/>
                    </Grid>
                </Grid>
            </PageContainer>
        );
    }
}

function mapStateToProps(store) {
    return {
        ...store.statsInfo,
        userType: store.userInfo.type,
        userKey: store.userInfo.userKey,
        offices: store.officeInfo.offices,
        users: store.userListInfo.users,
        office: store.userInfo.office_id,
        fetching: store.statsInfo.fetching
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchIndexStats, fetchOfficeList,fetchUserList}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Stats));


