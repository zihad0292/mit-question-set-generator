/** 
 * Created by Rajesh on 6/26/19. Modified by Zihad Ul Islam Mahdi on 9/16/19
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';

import { Scrollbars } from 'react-custom-scrollbars';
import {fetchDataTypes} from '../../../actions/dataTypesActions';
import {getAllColumns} from '../../../actions/indexRelationActions';
import {fetchCredentials} from '../../../actions/credentialsAction';

import {FullBodyLoader} from '../../../components/utils';

import SelectCredential from './SelectCredential';

const styles = theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 400,
        position: 'relative',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: theme.spacing(2),
    },
    title: {
        padding: theme.spacing(2, 1),
        backgroundColor: '#eee'
    },
    tableList: {
        maxHeight: 450,
        overflow: 'auto',
    },
    gridItem: {
        backgroundColor: theme.palette.background.paper,
    },
    listCard: {
        padding: 0,
        paddingBottom: '0!important',
        minHeight: 522,
        position: 'relative'
    },
    listTitleGrid: {
        padding: theme.spacing(1, 2),
        paddingBottom: 0
    }
});

class EditColumns extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTable: '',
            checked: [],
            columns: [],
            fieldTypes: [],
            credentialsDetails: [],
            selectedFieldType: '',
            selectedCredential: null,
            credentialId: null,
            tempValue: {
                idx: null,
                value: null
            },
            showCredentials: false,
            loading: false,
        };

        this.fetchTableColumn = this.fetchTableColumn.bind(this);
        this.prePopulateFromIndexTable = this.prePopulateFromIndexTable.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.onCredentialSelect = this.onCredentialSelect.bind(this);
        this.onEditCredentialClose = this.onEditCredentialClose.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onModalSubmit = this.onModalSubmit.bind(this);
    }

    componentDidMount(){
        const {dataTypes, fetchDataTypes} = this.props;

        this.setState({
            selectedTable: this.props.indexTable.tableName
        },this.fetchTableColumn);

        if(dataTypes.length == 0){
            fetchDataTypes();
        }
    }

    fetchTableColumn(){
        this.setState({loading: true});
        getAllColumns(this.state.selectedTable).then((res) => {
            if(res.success){
                this.setState({
                    columns: res.results,
                    loading: false
                }, this.prePopulateFromIndexTable);
            }
        })
    }

    handleTypeChange(idx, val){
        let {fieldTypes} = this.state;
        let tempValue = {
            idx: idx,
            value: fieldTypes[idx]
        }

        fieldTypes[idx] = val;

        this.setState({
           fieldTypes: fieldTypes
        });

        if(val === 'FTP' || val === 'SFTP' || val === 'ENCRYPTION'){
            this.setState({
                tempValue: tempValue,
                showCredentials: true,
                selectedFieldType: val
            });          
        }
    }

    onCredentialSelect(val){
        
    }


    onEditCredentialClose(){
        let {fieldTypes, tempValue} = this.state;
        fieldTypes[tempValue.idx] = tempValue.value;
        this.setState({
            showCredentials: false,
            selectedCredential: null,
            fieldTypes: fieldTypes
        });
    }

    onModalClose(){
        this.setState({
            showCredentials: false
        });
    }

    onModalSubmit(indexTableData){
        // let tempTables = this.state.indexTables;
        // tempTables.push(indexTableData);
        // this.setState({
        //     indexTables: tempTables,
        //     showModal: false
        // }, this.generateQuery);
    }

    prePopulateFromIndexTable(){
        const {indexTable} = this.props;
        const {columns, fieldTypes, credentialsDetails} = this.state;
        const checked = [];

        columns.map((column, idx) => {
            fieldTypes.push('PLAIN');
            credentialsDetails.push(null);
            indexTable.columns.map((indexColumn) => {
                if(column.COLUMN_NAME == indexColumn.COLUMN_NAME){
                    checked.push(idx);
                    fieldTypes.pop();
                    fieldTypes.push(indexColumn.FIELD_TYPE ? indexColumn.FIELD_TYPE : 'PLAIN');

                    credentialsDetails.pop();
                    credentialsDetails.push(indexColumn.CREDENTIAL ? indexColumn.CREDENTIAL : null);
                }
            });
        });
        this.setState({checked: checked});
    }

    handleToggle (value){
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        newChecked.sort(function(a, b){return a-b});

        this.setState({
            checked: newChecked,
        });
    }

    handleSubmit(credentialId = null){
        let tempIndexTable = this.props.indexTable;
        let tempCredentialsDetails = this.state.credentialsDetails;
        tempCredentialsDetails[this.state.tempValue.idx] = credentialId;

        tempIndexTable.columns = this.state.checked.map((idx) => {
            return {
                ...this.state.columns[idx],
                FIELD_TYPE: this.state.fieldTypes[idx],
                CREDENTIAL: tempCredentialsDetails[idx]
            };
        });

        if(this.props.onSubmit){
            this.props.onSubmit(tempIndexTable);
        }
    }

    renderColumnList(){
        const {classes, dataTypes} = this.props;
        let {columns, checked, fieldTypes} = this.state;

        const dataTypeMenu = dataTypes.map((item, typeIdx) => (
            <MenuItem value={item.dataType} key={typeIdx}>{item.dataType}</MenuItem>
        ));

        return columns.map((column, index) => {
            const defaultDataType = fieldTypes.length > 0 ? fieldTypes[index].toUpperCase() : 'PLAIN';

            return(
                <ListItem key={index} dense={true}>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked.indexOf(index) !== -1}
                                    onChange={(e) => this.handleToggle(index)}
                                    color="primary"
                                />
                            }
                            label={
                                <ListItemText
                                    primary={column.COLUMN_NAME}
                                    secondary={column.COLUMN_TYPE}
                                />
                            }
                        />
                        <FormControl className={classes.formControl}>
                            <Select
                                value={defaultDataType}
                                onChange={(e) => this.handleTypeChange(index, e.target.value)}
                                input={<Input name={'data-type-' + index} id={'data-type-' + index} disableUnderline/>}
                            >
                                {dataTypeMenu}
                            </Select>
                        </FormControl>
                    </Grid>
                </ListItem>
            )
        });
    }
    
    render(){
        const {classes} = this.props;
        const {loading, tempValue, checked} = this.state;

        return(
            <Paper className={classes.root}>
                <Card style={{width: '100%'}}>
                    <CardContent className={classes.listCard}>
                        <Typography variant="h6" className={classes.title}>
                            Select Columns
                        </Typography>
                        <Scrollbars style={{height: '450px'}}>
                            <Grid container direction="row" justify="flex-end" className={classes.listTitleGrid}>
                                <Typography variant="body2">Field Type</Typography>
                            </Grid>
                            <List>
                                {this.renderColumnList()}
                            </List>
                        </Scrollbars>
                        <FullBodyLoader active={loading}/>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={this.handleSubmit}>
                            Save
                        </Button>
                        <Button size="small" color="primary" onClick={() => {
                            if(this.props.onCancel){
                                this.props.onCancel();
                            }
                        }}>
                            Cancel
                        </Button>
                    </CardActions>
                </Card>
                <Modal
                    aria-labelledby="credentials-modal"
                    aria-describedby="credentials-fields"
                    disableAutoFocus={true}
                    open={this.state.showCredentials}
                    onClose={this.onEditCredentialClose}>
                    <SelectCredential onCancel={this.onEditCredentialClose} onSubmit={this.handleSubmit} selectedFieldType = {this.state.selectedFieldType} indexTable={this.props.indexTable} clickedColumnIndex={tempValue.idx} checked={checked}/>
                </Modal>
            </Paper>
            
        );
    }
}

EditColumns.propTypes = {
    classes: PropTypes.object.isRequired,
    indexTable: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};

function mapStateToProps(store) {
    return {
        ...store.dataTypesInfo,
        ...store.indexRelationInfo,
        message: store.indexRelationInfo.message
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchDataTypes, fetchCredentials}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditColumns));
