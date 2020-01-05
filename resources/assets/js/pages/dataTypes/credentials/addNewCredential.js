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
import IntegrationReactSelect from '../../../components/IntegrationReactSelect';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import {MessagePopUp} from '../../../components/messagePopUps';
import {fetchDataTypes} from '../../../actions/dataTypesActions';
import {addNewCredential, fetchCredentials, updateCredential} from '../../../actions/credentialsAction';
import {CustomSmallPaper, FlatButton} from '../../../components/utils';
import AddNewFtp from './components/addNewFtp';
import AddNewSftp from './components/addNewSftp';
import AddNewEncryption from './components/addNewEncryption';
import { height } from '@material-ui/system';

const styles = theme => ({
    tableTitle: {
        margin: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    cardContent: {
        padding: theme.spacing(0,2),
        minHeight: '500px'
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
    },
    spacingBottom: {
        marginBottom: '15px'
    }
});


class AddNewCredential extends Component{
    constructor(props){
        super(props);
        this.state = {
            ftpForm: false,
            sftpForm: false,
            encryptionForm: false,
            selected: null,
            selectedDataType: '',
            selectedData: ''
        };
        this.onFormSelect = this.onFormSelect.bind(this);
        this.handleMessageClose = this.handleMessageClose.bind(this);
    }


    componentDidMount(){
        const {selectedData} = this.props;

        if(this.props.dataTypes.length == 0) {
            this.props.fetchDataTypes();
        }
        const {type} = this.props;

        if(type == 'update'){
            this.setState({
                selectedData: selectedData,
            });
        }
    }

    componentWillReceiveProps(nextProps){

        if((this.props.added != nextProps.added && nextProps.added) || (this.props.updated != nextProps.updated && nextProps.updated)){
            this.props.fetchCredentials();
            // this.setState({
            //     ftpForm: false,
            //     sftpForm: false,
            //     encryptionForm: false
            // });
        }
        if(this.props.onComplete){
            this.props.onComplete();
        }
    }

    onFormSelect(val){
        if(val.label === 'FTP'){
            this.setState({
                ftpForm: true,
                sftpForm: false,
                encryptionForm: false,
                selected: val,
                selectedDataType: val
            });
        }else if(val.label === 'SFTP'){
            this.setState({
                ftpForm: false,
                sftpForm: true,
                encryptionForm: false,
                selected: val,
                selectedDataType: val
            });
        }else{
            this.setState({
                ftpForm: false,
                sftpForm: false,
                encryptionForm: true,
                selected: val,
                selectedDataType: val
            });

        }
    }

    handleMessageClose(){
        this.setState({
            showErrorMessage: false
        })
    }

    render(){

        const {ftpForm, sftpForm, encryptionForm, selectedData, selectedDataType} = this.state;
        const {dataTypes, type} = this.props;

        var formMarkup = '';
        var selectFormMarkup = '';

        let formList = dataTypes.filter((dataType)=> dataType.hasCredentials===true).map(dataType => {
            return {
                value: dataType._id,
                label: dataType.dataType.toUpperCase(),
            };
        });
        
        if(type==='update'){

            var dataTypeInfoFromDb = {
                value: selectedData.dataTypeId,
                label: selectedData.dataType,
            }
            if(selectedData.dataType === 'FTP'){
                formMarkup = <AddNewFtp type='update' selectedData={selectedData} selectedDataType={dataTypeInfoFromDb}/>
            }else if(selectedData.dataType === 'SFTP'){
                formMarkup = <AddNewSftp type='update' selectedData={selectedData} selectedDataType={dataTypeInfoFromDb}/>
            }else if(selectedData.dataType === 'ENCRYPTION'){
                formMarkup = <AddNewEncryption type='update' selectedData={selectedData} selectedDataType={dataTypeInfoFromDb}/>
            }
        }else{
            selectFormMarkup = <IntegrationReactSelect suggestions={formList} label="Form"
            onChange={this.onFormSelect}
            disabled = {this.props.type==='update'}
            />;

            if(ftpForm){
                formMarkup = <AddNewFtp selectedDataType={selectedDataType}/>
            }else if(sftpForm){
                formMarkup = <AddNewSftp selectedDataType={selectedDataType}/>
            }else if(encryptionForm){
                formMarkup = <AddNewEncryption selectedDataType={selectedDataType}/>
            }
        }
        

        const {showErrorMessage} = this.state;
        const {classes, adding, updating} = this.props;



        return(
            <CustomSmallPaper>
                <div className={classes.cardContent}>
                    {selectFormMarkup}
                    {formMarkup}                    
                </div>
            </CustomSmallPaper>
        );
    }
}

AddNewCredential.propTypes = {
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
        credentials: store.credentialsInfo.credentials,
        dataTypes: store.dataTypesInfo.dataTypes,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addNewCredential, fetchCredentials, updateCredential, fetchDataTypes }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddNewCredential));