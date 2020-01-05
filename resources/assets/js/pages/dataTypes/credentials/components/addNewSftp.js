// Created by Zihad Ul Islam Mahdi on 9/2/19. Modified on 9/8/19

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IntegrationReactSelect from '../../../../components/IntegrationReactSelect';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import {MessagePopUp} from '../../../../components/messagePopUps';
import {addNewCredential, fetchCredentials, updateCredential} from '../../../../actions/credentialsAction';
import {CustomSmallPaper, FlatButton} from '../../../../components/utils';

const styles = theme => ({
    tableTitle: {
        margin: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    cardContent: {
        padding: theme.spacing(0,2)
    },
    submitButton: {
        margin: theme.spacing(2, 0),
        padding: theme.spacing(1.5)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    },
    connectionMessage: {
        display: 'inline-flex',
        alignItems: 'center',
        color: theme.palette.error.main,
        marginLeft: 5
    },
    connectionMessageSuccess: {
        color: theme.palette.secondary.light,
    }
});


class AddNewSftp extends Component{
    constructor(props){
        super(props);
        this.state = {
            form: 'sftp',
            sftpName : '',
            sftpServer : '',
            sftpPort : 22,
            sftpUser : '',
            sftpKey : '',
            sftpFile : null,
            sftpFileName : '',
            tempKey:'',
            tempFileName:'',
            showFileName: true,
            homeDirectory: '',
            enable: false,
            showErrorMessage:false,
            connection: {
                status: false,
                checking: false,
                checked: false,
                message: ""
            }
        };
        this.populateStateVal = this.populateStateVal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        //this.handleCheckConnection = this.handleCheckConnection.bind(this);
        this.handleMessageClose = this.handleMessageClose.bind(this);
        this.fileHandler = this.fileHandler.bind(this);
    }

    componentDidMount(){
        const {type} = this.props;
        if(type == 'update'){
            this.populateStateVal();
        }
    }

    populateStateVal(){
        const {selectedData} = this.props;
        
        this.setState({
            sftpName: selectedData.credentialName,
            sftpServer: selectedData.host,
            sftpPort: selectedData.port,
            sftpUser: selectedData.user,
            sftpKey: selectedData.key,
            tempKey: selectedData.key,
            sftpFileName: selectedData.fileName,
            tempFileName: selectedData.fileName,
            homeDirectory: selectedData.homeDirectory,
            enable: selectedData.enable
        });
    }
    
    componentWillReceiveProps(nextProps){

        if((this.props.added != nextProps.added && nextProps.added) || (this.props.updated != nextProps.updated && nextProps.updated)){
            this.props.fetchCredentials();
            this.setState({
                sftpName : '',
                sftpServer : '',
                sftpPort : 22,
                sftpUser : '',
                sftpKey : '',
                sftpFile : null,
                sftpFileName : '',
                tempKey:'',
                tempFileName:'',
                showFileName: true,
                homeDirectory: '',
                enable: false,
                showErrorMessage:false,
                connection: {
                    status: false,
                    checking: false,
                    checked: false,
                    message: ""
                }
            });
        }
        if(this.props.onComplete){
            this.props.onComplete();
        }
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleCheckboxChange(event){
        this.setState({
            [event.target.name]: event.target.checked
        });
    }

    fileHandler(event){
        var input = event.target;
        if(input.files[0]){
            var reader = new FileReader();
            reader.onload = (e) => {
                var data = encodeURIComponent(reader.result.toString());
                return this.setState({
                    sftpKey: data,
                    sftpFileName: input.files[0].name,
                    showFileName: false
                });
            };
            reader.readAsText(input.files[0]);
        }else{
            if(this.props.type==='update'){
                this.setState({
                    sftpKey: this.state.tempKey,
                    sftpFileName: this.state.tempFileName,
                    showFileName: true,
                });
            }else{
                this.setState({
                    sftpKey: '',
                    sftpFileName: '',
                    showFileName: false,
                });
            }
        }

        
    }

    handleSubmit(){
        const {form, sftpName, sftpServer, sftpPort, sftpUser, pass, enable, sftpKey, sftpFileName, homeDirectory, connection} = this.state;
        const {type, selectedData, addNewCredential, updateCredential, selectedDataType} = this.props;

        if(sftpName === '' || sftpServer === '' || sftpPort === '' || sftpUser === '' || sftpFileName === ''){
            this.setState({
                showErrorMessage: true
            });
        }else if(type == 'update'){
            updateCredential(selectedData._id, form, sftpName, selectedDataType, sftpServer, sftpPort, sftpUser, pass, enable, sftpKey, sftpFileName, homeDirectory);
        }else {
            addNewCredential(form, sftpName, selectedDataType, sftpServer, sftpPort, sftpUser, pass, enable, sftpKey, sftpFileName, homeDirectory);
        }
       
    }

    handleMessageClose(){
        this.setState({
            showErrorMessage: false
        })
    }

    renderCheckConnectionButton(){
        const {classes} = this.props;
        const {connection} = this.state;
        const messageIcon = () => {
            return (
                <div className={`${classes.connectionMessage} ${connection.status ? classes.connectionMessageSuccess : ''}`}>
                    <Icon>{connection.status ? 'done' : 'error'}</Icon>
                    <Typography variant="body2">{connection.message}</Typography>
                </div>
            );
        };

        return(
            <Grid container direction="row" justify="flex-start" alignItems="center" style={{marginTop: '7px'}}>
                <Button size="small" variant="outlined" color="secondary"
                        disabled={this.state.sftpServer.length == 0 || this.state.sftpPort.length == 0 || this.state.sftpUser.length == 0 || this.state.sftpFileName.length === 0}
                        onClick={this.handleCheckConnection}>
                    Verify Connection
                </Button>
                {connection.checking && <CircularProgress color="secondary" size={20}/>}
                {connection.checked && messageIcon()}
            </Grid>
        );
    }

    render(){
        const {showErrorMessage} = this.state;
        const {classes, adding, updating, type} = this.props;

        console.log(this.state)

        return(
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="sftp-name" name="sftpName" label="Name" value={this.state.sftpName}
                            margin="normal" variant="outlined" fullWidth
                            onChange={this.handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="sftp-server" name="sftpServer" label="sFTP Server" value={this.state.sftpServer}
                            margin="normal" variant="outlined" fullWidth
                            onChange={this.handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            id="sftp-port" name="sftpPort" label="Port" value={this.state.sftpPort}
                            margin="normal" variant="outlined" fullWidth
                            onChange={this.handleChange}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            id="sftp-user" name="sftpUser" label="sFTP User" value={this.state.sftpUser}
                            margin="normal" variant="outlined" fullWidth
                            onChange={this.handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={12}>
                        <Input type="file" name="file" onChange={this.fileHandler}/>
                        {(this.state.showFileName && this.props.type==='update')?<div>{this.state.sftpFileName}</div>:''}
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="home-directory" name="homeDirectory" label="Home Directory" value={this.state.homeDirectory}
                            margin="normal" variant="outlined" fullWidth
                            onChange={this.handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={6}>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox name="enable" checked={this.state.enable} onChange={this.handleCheckboxChange} value={this.state.enable} />}
                                label="Enabled"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        {this.renderCheckConnectionButton()}
                    </Grid>
                </Grid>
                <FlatButton variant="contained" color="primary"
                            disabled={adding || updating} className={classes.submitButton}
                            size='large' fullWidth onClick={this.handleSubmit}>
                    {type === 'update' ? 'Update' : 'Save'}
                    <Icon className={classes.rightIcon}>save</Icon>
                </FlatButton>
                <MessagePopUp visible={showErrorMessage} variant='error' onClose={this.handleMessageClose} message="Please fill in all the fields"/>
            </div>
        );
    }
}

AddNewSftp.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['add', 'update']),
    selectedData: PropTypes.object,
    onComplete: PropTypes.func
};

function mapStateToProps(store) {
    return {
        added : store.credentialsInfo.added,
        adding: store.credentialsInfo.adding,
        updating: store.credentialsInfo.updating,
        updated: store.credentialsInfo.updated,
        credentials: store.credentialsInfo.credentials
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addNewCredential, fetchCredentials, updateCredential }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddNewSftp));