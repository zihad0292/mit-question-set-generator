// Created by Zihad Ul Islam Mahdi on 9/2/19

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
import Button from '@material-ui/core/Button';

import {MessagePopUp} from '../../../../components/messagePopUps';
import {addNewEncryption, fetchCredentials, updateEncryption, fetchEncryptions} from '../../../../actions/credentialsAction';

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
    }
});


class AddNewEncryption extends Component{
    constructor(props){
        super(props);
        this.state = {
            encryptionName: '',
            encryptionError: false,
            enable: false,
            showErrorMessage:false,
        };
        this.populateStateVal = this.populateStateVal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleMessageClose = this.handleMessageClose.bind(this);
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
            encryptionName: selectedData.name,
            enable: selectedData.enable
        });
    }
    
    componentWillReceiveProps(nextProps){

        const showPops = nextProps.message && nextProps.message.length > 0;

        if((this.props.added != nextProps.added && nextProps.added) || (this.props.updated != nextProps.updated && nextProps.updated)){
            this.props.fetchCredentials();
            this.setState({
                showMessage: showPops,
                encryptionName: '',
                enable: false,
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

    handleSubmit(){
        const {encryptionName, enable} = this.state;
        const {selectedData, selectedDataType, type, addNewEncryption, updateEncryption} = this.props;

        if(encryptionName === ''){
            this.setState({
                showErrorMessage: true
            });
        }else{
            if(type == 'update'){
                updateEncryption(selectedData._id, encryptionName, selectedDataType, enable);
            }else {
                addNewEncryption(encryptionName, selectedDataType, enable);
            }
        }

        
    }

    handleMessageClose(){
        this.setState({
            showErrorMessage: false
        })
    }


    render(){
        const {showErrorMessage} = this.state;
        const {classes, adding, updating, type} = this.props;
        return(
            <div>
                <TextField
                    id="encryption-name"
                    name="encryptionName"
                    label="Encryption Name"
                    value={this.state.encryptionName}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={this.handleChange}
                />
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox name="enable" checked={this.state.enable} onChange={this.handleCheckboxChange} value={this.state.enable} />}
                        label="Enabled"
                    />
                </FormGroup>
                <FlatButton variant="contained" color="primary"
                            disabled={adding || updating} className={classes.submitButton}
                            size='large' fullWidth onClick={this.handleSubmit}>
                    {type === 'update' ? 'Update' : 'Save'}
                    <Icon className={classes.rightIcon}>save</Icon>
                </FlatButton>
                <MessagePopUp visible={showErrorMessage} variant='error' onClose={this.handleMessageClose} message="Please fill in the name field"/>
            </div>
        );
    }
}

AddNewEncryption.propTypes = {
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
    return bindActionCreators({ addNewEncryption, fetchCredentials, updateEncryption }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddNewEncryption));