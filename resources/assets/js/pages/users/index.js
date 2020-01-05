/**
 * Created by Rajesh on 6/18/19. Modified by Zihad Ul Islam Mahdi on 8/21/19.
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
import {MessagePopUp} from '../../components/messagePopUps';

import {fetchUserList, deleteUserInfo} from '../../actions/usersListActions';
import {PageContainer, CustomSmallPaper, WidgetTitle, ConfirmDialog, FullBodyLoader} from '../../components/utils';

import AddNewUser from './addNewUser';

const styles = theme => ({
    userCard: {
        width: 200,
        height: 290,
        padding: theme.spacing(1),
        margin: theme.spacing(2),
        marginLeft: theme.spacing(0),
        marginTop: theme.spacing(0)
    },
    cardContainer: {
        height: '100%'
    },
    largeIcon: {
        width: 75,
        height: 75,
        fontSize: 75,
        color: '#666'
    },
    apiKeyText: {
        color: 'gray',
        wordBreak: 'break-word',
        fontSize: '10px'
    },

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
    }
});


class Users extends Component{
    constructor(props){
        super(props);
        this.state = {
            message: '',
            showMessage:false,
            showUpdate: false,
            selected: null,
            confirm: false
        };

        this.onModalClose = this.onModalClose.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
        this.handleMessageClose = this.handleMessageClose.bind(this);
    }

    componentDidMount(){
        if(this.props.users.length == 0 ){
            this.props.fetchUserList();
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
            this.props.fetchUserList();
        }
    }

    onDeleteClick(selectedIndex, userId=null){
        if(userId) {
            const {users} = this.props;
            selectedIndex = users.findIndex(x => x._id === userId);
        }
        this.setState({
            selected: selectedIndex,
            confirm: true
        });
    }

    onDeleteSubmit(){
        const {users} = this.props;
        const {selected} = this.state;

        //console.log(users[selected]);

        this.props.deleteUserInfo(users[selected]._id);
        this.setState({
            confirm: false
        });
    }

    onEditClick(selectedIndex, userId=null){
        if(userId) {
            const {users} = this.props;
            selectedIndex = users.findIndex(x => x._id === userId);
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

    renderUserTable(){
        const {users, classes} = this.props;

        const columns = [
            {
                title: 'Email', field: 'email', sorting: false
            },
            {
                title: 'Office Name', field: 'office_name', sorting: false
            },
            {
                title: 'API-Key', field: 'secondary_key', sorting: false
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
            Action: props => (
                <IconButton aria-label="delete" size="small"
                    disabled={props.data.email === 'admin@pipilika.com'}
                    onClick={(event) => props.action.onClick(event, props.data)}
                    >
                    <Icon>delete</Icon>
                </IconButton>
            )
        };

        const actions = [
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
                data={users}
                actions={actions}
                options={options}
                components={components}
                style={{overflow: 'hidden'}}
            />
        );

    }

    render(){

        const {classes, users, fetching, deleting} = this.props;
        const {selected, showMessage, message} = this.state;

        return(
            <PageContainer maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8} className={classes.relativeContainer}>
                        <WidgetTitle>
                            All Users List
                        </WidgetTitle>
                        {this.renderUserTable()}
                        <FullBodyLoader active={fetching || deleting}/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <WidgetTitle>
                            Add New User
                        </WidgetTitle>
                        <AddNewUser/>
                    </Grid>
                </Grid>
                <ConfirmDialog
                    title="Confirm Delete?"
                    description="Do You Really Want to Delete this User? This means user cannot log in and do activity in future."
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
        userType: store.userInfo.type,
        users: store.userListInfo.users,
        message: store.userListInfo.message,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUserList, deleteUserInfo }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Users));
