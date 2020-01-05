/**
 * Created by Zihad Ul Islam Mahdi on 9/2/19
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MaterialTable, {MTableToolbar} from 'material-table';
import Chip from '@material-ui/core/Chip';
import {MessagePopUp} from '../../../components/messagePopUps';

import {fetchCredentials, deleteCredential} from '../../../actions/credentialsAction';
import {PageContainer, CustomSmallPaper, WidgetTitle, FullBodyLoader, ConfirmDialog} from '../../../components/utils';

import AddNewCredential from './addNewCredential';
import UpdateCredential from './updateCredential';

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

class Credentials extends Component {

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

        if(this.props.credentials.length == 0) {
            this.props.fetchCredentials();
        }
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.message && nextProps.message.length > 0){
            this.setState({
                message: nextProps.message,
                showMessage: true
            });
        }


        if(this.props.deleted != nextProps.deleted && nextProps.deleted){
            this.props.fetchCredentials();
        }
    }

    onDeleteClick(selectedIndex, credentialId=null){
        if(credentialId) {
            const {credentials} = this.props;
            selectedIndex = credentials.findIndex(x => x._id === credentialId);
        }

        this.setState({
            selected: selectedIndex,
            confirm: true
        });
    }

    onDeleteSubmit(){
        const {credentials} = this.props;
        const {selected} = this.state;

        this.props.deleteCredential(credentials[selected]._id);

        this.setState({
            confirm: false
        });
    }

    onEditClick(selectedIndex, dataTypeId=null){
        if(dataTypeId) {
            const {credentials} = this.props;
            selectedIndex = credentials.findIndex(x => x._id === dataTypeId);
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


    renderDataTable(){
        const {credentials, classes} = this.props;
        const columns = [
            {
                title: 'Data Type', field: 'dataType', sorting: false
            },
            {
                title: 'Name', field: 'name', sorting: false
            },
            {
                title: 'Server', field: 'server', sorting: false
            },
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
            },
            // Action: props => (
            //     <IconButton aria-label="delete" size="small"
            //         disabled={props.data.email === 'admin@pipilika.com'}
            //         onClick={(event) => props.action.onClick(event, props.data)}
            //         >
            //         <Icon>delete</Icon>
            //     </IconButton>
            // )
            
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
                title="Created Credentials List"
                columns={columns}
                data={credentials}
                actions={actions}
                options={options}
                components={components}
                style={{overflow: 'hidden'}}
            />
        );

    }

    render(){
        const {classes, fetching, deleting, credentials} = this.props;
        const {selected, showMessage, message} = this.state;

        return(
            <PageContainer maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8} className={classes.relativeContainer}>
                        <WidgetTitle>
                            All Credentials List
                        </WidgetTitle>
                        {this.renderDataTable()}
                        <FullBodyLoader active={fetching || deleting}/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <WidgetTitle>
                            Add New Credential
                        </WidgetTitle>
                        <AddNewCredential/>
                    </Grid>
                </Grid>
                <Modal
                    aria-labelledby="dataType-edit-modal"
                    aria-describedby="dataType-edit-modal"
                    disableAutoFocus={true}
                    open={this.state.showUpdate}
                    onClose={this.onModalClose}>
                    <UpdateCredential selectedData={credentials[selected]} onUpdateComplete={this.onModalClose}/>
                </Modal>
                <ConfirmDialog
                    title="Confirm Delete?"
                    description="Do You Really Want to Delete this Data Type? This means all of the users from this Data Type won't be able to log in and do activity in future."
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
        ...store.credentialsInfo,
        userType: store.userInfo.type,
        credentials: store.credentialsInfo.credentials,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchCredentials, deleteCredential }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Credentials));

