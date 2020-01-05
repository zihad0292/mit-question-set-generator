/**
 * Created by Rajesh on 6/13/19.
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MaterialTable, {MTableToolbar} from 'material-table';
import {MessagePopUp} from '../../components/messagePopUps';

import {fetchDBConfigList, setDBConfigToken, deleteDBConfig} from '../../actions/dbConfigActions';
import {fetchOfficeList} from '../../actions/officeActions';
import {PageContainer, CustomSmallPaper, WidgetTitle, FullBodyLoader, ConfirmDialog} from '../../components/utils';

import AddNewDB from './addNewDB';
import UpdateDatabase from './updateDb';

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
    iconWidth: {
        width: '24px'
    }
});

class DBConfig extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showUpdate: false,
            selected: null,
            confirm: false,
            message: '',
            showMessage: false
        };

        this.onModalClose = this.onModalClose.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
        this.handleMessageClose = this.handleMessageClose.bind(this);
    }

    componentDidMount(){
        const {offices, dbConfigs, userType, office, fetchOfficeList} = this.props;

        if(dbConfigs.length == 0 && userType !== 'admin') {
            this.props.fetchDBConfigList();
        }

        if(offices.length == 0){
            if(userType == 'admin') {
                fetchOfficeList(office);
            }else{
                fetchOfficeList();
            }
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
            this.props.fetchDBConfigList(nextProps.token);
        }
    }

    onDeleteClick(selectedIndex, configId=null){
        if(configId) {
            const {dbConfigs} = this.props;
            selectedIndex = dbConfigs.findIndex(x => x._id === configId);
        }

        this.setState({
            selected: selectedIndex,
            confirm: true
        });
    }

    onDeleteSubmit(){
        const {dbConfigs} = this.props;
        const {selected} = this.state;

        this.props.deleteDBConfig(dbConfigs[selected]._id);

        this.setState({
            confirm: false
        });
    }

    onEditClick(selectedIndex, configId=null){
        if(configId) {
            const {dbConfigs} = this.props;
            selectedIndex = dbConfigs.findIndex(x => x._id === configId);
        }

        this.setState({
            selected: selectedIndex,
            showUpdate: true,
        });
    }

    onModalClose(){
        this.setState({
            showUpdate: false,
            confirm: false
        })
    }

    handleMessageClose(){
        this.setState({
            showMessage: false
        })
    }

    renderDbConfigRow(){
        const {dbConfigs, classes} = this.props;

        if(dbConfigs.length > 0){
            return dbConfigs.map((config, idx) => {
                return(
                    <CustomSmallPaper key={"config-item-" + idx} elevation={2} className={classes.dbCardRow}>
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <Grid item xs={1}>
                                <img src="/images/database.png" className={classes.dbRowImage}/>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="body1">{config.name}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption">{config.dbName}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="caption" align="center" className={classes.enableText}>
                                    <Icon color={config.enable ? 'secondary' : 'error'} fontSize="small" className={classes.enableIcon}>fiber_manual_record</Icon>
                                    {config.enable ? 'Enabled' : 'Disabled'}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Grid container direction="row" justify="flex-end">
                                    <IconButton aria-label="edit" size="small"
                                                onClick={() => this.onEditClick(idx)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                    <IconButton aria-label="delete" size="small"
                                                onClick={() => this.onDeleteClick(idx)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CustomSmallPaper>
                );
            });
        }
    }

    renderDbConfigTable(){
        const {dbConfigs, classes} = this.props;

        const columns = [
            {
                title: 'Name', field: 'name', sorting: false
            },
            {
                title: 'Database Name', field: 'dbName', sorting: false
            },
            {
                title: 'Host', field: 'host', sorting: false
            },
            {
                title: 'Enabled',
                field: 'enabled',
                sorting: false,
                render: (rowData) => {
                    return(
                        <Chip variant="outlined" color={rowData.enable ? 'secondary' : 'default'}
                              label={rowData.enable ? 'Enabled' : 'Disabled'} size="small"
                              icon={<Icon className={classes.iconWidth}>fiber_manual_record</Icon>} />
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
                icon: 'edit',
                tooltip: 'Edit Index',
                onClick: (event, rowData) => {
                    //history.push('/dashboard/index_relation/' + rowData._id + "/edit");
                    this.onEditClick(null, rowData._id);
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
                data={dbConfigs}
                actions={actions}
                options={options}
                components={components}
                style={{overflow: 'hidden'}}
            />
        );

    }

    render(){
        const {classes, fetching, deleting, dbConfigs} = this.props;
        const {selected, showMessage, message} = this.state;

        return(
            <PageContainer maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8} className={classes.relativeContainer}>
                        <WidgetTitle>
                            All Database List
                        </WidgetTitle>
                        {this.renderDbConfigTable()}
                        <FullBodyLoader active={fetching || deleting}/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <WidgetTitle>
                            Add New Database
                        </WidgetTitle>
                        <AddNewDB/>
                    </Grid>
                </Grid>
                <Modal
                    aria-labelledby="dbconfig-edit-modal"
                    aria-describedby="dbconfig-edit-modal"
                    disableAutoFocus={true}
                    open={this.state.showUpdate}
                    onClose={this.onModalClose}>
                    <UpdateDatabase selectedDb={dbConfigs[selected]} onUpdateComplete={this.onModalClose}/>
                </Modal>
                <ConfirmDialog
                    title="Confirm Delete?"
                    description="Do You Really Want to Delete this Database Config. This means database info will be lost and cannot be connected in future."
                    active={this.state.confirm}
                    onClose={this.onModalClose}
                    onSubmit={this.onDeleteSubmit}/>

                <MessagePopUp visible={showMessage} variant='success' onClose={this.handleMessageClose} message={message}/>
            </PageContainer>
        );
    }

}

function mapStateToProps(store) {
    return {
        ...store.dbConfigInfo,
        userType: store.userInfo.type,
        offices: store.officeInfo.offices,
        office: store.userInfo.office_id,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchDBConfigList, setDBConfigToken, deleteDBConfig, fetchOfficeList }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DBConfig));
