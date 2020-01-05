/**
 * Created by Rajesh on 6/15/19. Modified by Zihad Ul Islam Mahdi on 8/25/19
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';

import MaterialTable, {MTableToolbar} from 'material-table';
import TimeAgo from 'javascript-time-ago';
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import {MessagePopUp} from '../../components/messagePopUps';

import IntegrationReactSelect from '../../components/IntegrationReactSelect';

import {fetchDBConfigList, setDBConfigToSession, setDBConfigToken} from '../../actions/dbConfigActions';
import {fetchOfficeList} from '../../actions/officeActions';
import {setIndexRelation, setDbConfig} from '../../actions/indexSearchActions';
import {fetchIndexRelations, deleteIndexRelation, clearIndexRelationMessage} from '../../actions/indexRelationActions';
import {PageContainer, CustomSmallPaper, WidgetTitle, FullBodyLoader, ConfirmDialog, FlatButton} from '../../components/utils';

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

const styles = theme => ({
    alignRight: {
        textAlign: 'right'
    },
    tableTitle: {
        margin: theme.spacing(2,0)
    },
    listTitle: {
        marginTop: theme.spacing(2)
    },
    indexCard: {
        height: 250,
    },
    media: {
        height: '100%'
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        color: '#fff',
        paddingBottom: '12px!important'
    },
    cardActions: {
        padding: 0
    },
    marginOnRight: {
        marginRight: theme.spacing(2)
    },
    enabledText: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        color: 'white',
        right: 0,
        padding: theme.spacing(1)
    },
    enableIcon: {
        marginLeft: 2,
        top: -1,
        position: 'relative'
    },
    relativePosition: {
        position: 'relative'
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    },
    searchButton: {
        minWidth: 20
    },
    searchButton: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(1)
    },
    toolbarStyle: {
        backgroundImage: "url('/images/index-relation-banner.png')",
        minHeight: 140,
        backgroundSize: 'cover'
    },
    iconWidth: {
        width: '24px'
    }
});

class IndexRelation extends Component{

    constructor(props){
        super(props);

        this.state = {
            dbName: '',
            dbId: '',
            confirm: false,
            selected: null,
            message: '',
            showMessage: false
        };

        this.onDbConfigSelect = this.onDbConfigSelect.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
        this.handleMessageClose = this.handleMessageClose.bind(this);
    }

    componentDidMount(){
        const {offices, dbConfigs, userType, office, fetchOfficeList} = this.props;

        this.props.clearIndexRelationMessage();

        if(dbConfigs.length == 0 && userType !== 'admin'){
            this.props.fetchDBConfigList();
        }else{
            this.setState({ dbId: this.props.dbConfig});
        }

        if(offices.length == 0){
            if(userType == 'admin') {
                fetchOfficeList(office);
            }else{
                fetchOfficeList();
            }
        }

        if(this.props.message && this.props.message.length > 0){
            this.setState({
                message: this.props.message,
                showMessage: true
            });
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.message && nextProps.message.length > 0){
            this.setState({
                message: nextProps.message,
                showMessage: true
            });
        }

        if(this.props.offices.length == 0 && nextProps.offices.length > 0) {

            if(nextProps.userType == 'admin'){
                const token = nextProps.offices[0].primary_key;
                this.props.setDBConfigToken(token);
            }
        }

        if(this.props.token != nextProps.token && this.props.userType == 'admin'){
            this.props.fetchDBConfigList(nextProps.token);
        }

        if(!this.props.deleted && nextProps.deleted){
            this.props.fetchIndexRelations(this.state.dbId);
        }
    }

    onDeleteClick(selectedIndex, indexId=null){

        if(indexId) {
            const {indexRelations} = this.props;
            selectedIndex = indexRelations.findIndex(x => x._id === indexId);
        }

        this.setState({
            selected: selectedIndex,
            confirm: true
        });
    }

    onDeleteSubmit(){
        const {indexRelations} = this.props;
        const {selected} = this.state;

        this.props.deleteIndexRelation(indexRelations[selected]._id);

        this.setState({
            confirm: false
        });
    }

    onSearchClick(indexId){
        const {dbId} = this.state;
        const {history, setIndexRelation, setDbConfig} = this.props;

        setDbConfig(dbId);
        setIndexRelation(indexId);

        history.push('/dashboard/search/');
    }

    onDbConfigSelect(val){
        const configDB = this.props.dbConfigs[val.value];
        const {_id, name, dbName, host, port, user, password} = configDB;

        this.setState({
            dbName: val.label,
            dbId: _id
        });
        this.props.fetchIndexRelations(_id);
        this.props.setDBConfigToSession(name, host, port, user, password, dbName);
    }

    handleMessageClose(){
        this.setState({
            showMessage: false
        })
    }


    renderMaterialTable(){
        const {classes, indexRelations, history} = this.props;

        const columns = [
            {title: 'Name', field: 'name', sorting: false },
            {
                title: 'Enabled',
                field: 'enable',
                sorting: false,
                render: (rowData) => {
                    return(
                        <Chip variant="outlined" color={rowData.enable ? 'secondary' : 'default'}
                              label={rowData.enable ? 'Enabled' : 'Disabled'} size="small"
                              icon={<Icon className={classes.iconWidth}>fiber_manual_record</Icon>} />
                    );
                }
            },
            {
                title: 'Last Crawled',
                field: 'lastCrawledAt',
                render: (rowData) => {
                    return (
                        <Typography variant="body2" component="p">
                            {rowData.lastCrawledAt ? timeAgo.format(new Date(rowData.lastCrawledAt)) : 'Not Available'}
                        </Typography>
                    );
                }
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

        const actions = [
            {
                icon: 'search',
                tooltip: 'Search Index',
                onClick: (event, rowData) => {
                    // Do save operation
                    this.onSearchClick(rowData._id);
                }
            },
            {
                icon: 'edit',
                tooltip: 'Edit Index',
                onClick: (event, rowData) => {
                    history.push('/dashboard/index_relation/' + rowData._id + "/edit");
                }
            },
            {
                icon: 'delete',
                tooltip: 'Delete Index',
                onClick: (event, rowData) => {
                    this.onDeleteClick(null, rowData._id);
                }
            },
        ];

        const options= {
            showTitle: false,
            actionsColumnIndex: -1,
            searchFieldStyle: {
                color: "#fff"
            }
        };

        return(
            <MaterialTable
                title="Created Index List"
                columns={columns}
                data={indexRelations}
                components={components}
                actions={actions}
                options={options}
                style={{overflow: 'hidden'}}
            />
        );
    }

    render(){
        const {classes, dbConfig, dbConfigs, fetching, connected, history} = this.props;
        const {showMessage, message} = this.state;

        let selectedDb = null;

        const dbConfigList = dbConfigs.map((config, idx) => {
            if(dbConfig && dbConfig == config._id) {
                selectedDb = {
                    value: idx,
                    label: config.dbName,
                };
            }

            return{
                value: idx,
                label: config.dbName,
            };
        });

        return(
            <PageContainer maxWidth="lg">
                <WidgetTitle>Index Relation Page</WidgetTitle>
                <Grid container spacing={2}>
                    <Grid item sm={8} xs={12}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="subtitle1" component="p">
                                    Select Database
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <IntegrationReactSelect suggestions={dbConfigList}
                                                onChange={this.onDbConfigSelect}
                                                selected={selectedDb}
                                                label="Database List" disabled={fetching}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <WidgetTitle small className={classes.listTitle}>
                            Created Index List
                        </WidgetTitle>
                    </Grid>
                    <Grid item xs={12} sm={4} className={classes.alignRight}>
                        <FlatButton variant="contained" color="primary"
                                        disabled={!connected} className={classes.searchButton}
                                        size='small' fullWidth={false} onClick={() => history.push('/dashboard/index_relation/' + this.state.dbId + '/new')}>
                            Add New Index
                            <Icon className={classes.rightIcon}>add_circle</Icon>
                        </FlatButton>
                    </Grid>
                    <Grid item sm={8} xs={12} className={classes.relativePosition}>
                        {/* {this.renderIndexRelationBlock()} */}
                        {this.renderMaterialTable()}
                        <FullBodyLoader active={fetching}/>
                    </Grid>
                </Grid>
                <ConfirmDialog title="Confirm Delete?"
                               description="Do you really want to delete this Index Relation? This means you can not Index Data from this index relation."
                               active={this.state.confirm} onClose={() => this.setState({confirm: false})}
                               onSubmit={this.onDeleteSubmit} />

                <MessagePopUp visible={showMessage} variant='success' onClose={this.handleMessageClose} message={message}/>

            </PageContainer>
        );
    }
}

function mapStateToProps(store) {
    return {
        ...store.indexRelationInfo,
        dbConfigs: store.dbConfigInfo.dbConfigs,
        connecting: store.dbConfigInfo.connecting,
        connected: store.dbConfigInfo.connected,
        token: store.dbConfigInfo.token,
        userType: store.userInfo.type,
        offices: store.officeInfo.offices,
        office: store.userInfo.office_id,
        message: store.indexRelationInfo.message
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchIndexRelations, deleteIndexRelation, clearIndexRelationMessage,
        setIndexRelation, setDbConfig,
        fetchDBConfigList, setDBConfigToSession, setDBConfigToken,
        fetchOfficeList
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(IndexRelation)));