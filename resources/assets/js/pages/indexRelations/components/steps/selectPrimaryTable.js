/**
 * Created by Rajesh on 5/19/19. Modified by Zihad Ul Islam Mahdi on 9/16/19
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Scrollbars } from 'react-custom-scrollbars';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Modal from '@material-ui/core/Modal';

import {FullBodyLoader} from '../../../../components/utils';
import {getAllColumns} from '../../../../actions/indexRelationActions';

import SelectCredential from '../SelectCredential';

const styles = theme => ({
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

class SelectPrimaryTable extends Component{
    constructor(props) {
        super(props);

        this.state = {
            indexTable: {
                columns: null
            },
            selectedTable: null,
            checked: [],
            columns: [],
            fieldTypes: [],
            credentialsDetails: [],
            activeStep: 0,
            tempValue: {
                idx: null,
                value: null
            },
            showCredentials: false,
            selectedFieldType: null,
            loading: false
        };

        this.fetchTableColumn = this.fetchTableColumn.bind(this);
        this.setSelectedTable = this.setSelectedTable.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.renderTableList = this.renderTableList.bind(this);
        this.renderColumnList = this.renderColumnList.bind(this);
        this.onEditCredentialClose = this.onEditCredentialClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    fetchTableColumn(){
        this.setState({loading: true});
        getAllColumns(this.state.selectedTable).then((res) => {
            if(res.success){
                const tempFieldTypes = new Array(res.results.length).fill('PLAIN');
                const tempCredentialsDetails = new Array(res.results.length).fill(null);
                this.setState({
                    indexTable: {
                        columns: res.results
                    },
                    columns: res.results,
                    fieldTypes: tempFieldTypes,
                    credentialsDetails: tempCredentialsDetails,
                    loading: false
                });
            }
        })
    }

    setSelectedTable(tableName){
        if(tableName !== this.state.selectedTable) {
            this.setState({
                selectedTable: tableName,
                checked: [],
            }, () => {
                this.props.onTableSelect(tableName);
                this.fetchTableColumn()
            });

        }
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

    handleToggle (value){
        const { checked, columns } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        newChecked.sort(function(a, b){return a-b});

        let columnList = newChecked.map((item) => {
            return {
                ...columns[item],
                FIELD_TYPE: this.state.fieldTypes[item]
            };
        });

        this.setState({
            checked: newChecked,
        }, () => this.props.onColumnSelect(columnList));
    }


    handleSubmit(credentialId = null){

        let {fieldTypes, checked, columns, tempValue} = this.state;
        let tempCredentialsDetails = this.state.credentialsDetails;

        tempCredentialsDetails[tempValue.idx] = credentialId;


        let columnList = checked.map((item, idx) => {
            return {
                ...columns[item],
                FIELD_TYPE: fieldTypes[item],
                CREDENTIAL: tempCredentialsDetails[item]
            };
        });

        if(this.props.onColumnSelect){
            this.props.onColumnSelect(columnList);
            this.setState({
                showCredentials: false
            });  
        }

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
                   {/*<Checkbox*/}
                       {/*checked={checked.indexOf(index) !== -1}*/}
                       {/*tabIndex={-1}*/}
                       {/*disableRipple/>*/}
                   {/*<ListItemText*/}
                       {/*primary={column.COLUMN_NAME}*/}
                       {/*secondary={column.COLUMN_TYPE}*/}
                   {/*/>*/}
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

    renderTableList(){
        let {tables, usedTables} = this.props;
        return tables.map((table, index) => {
            return(
                <ListItem button key={index}
                          selected={this.state.selectedTable == table}
                          disabled={usedTables.indexOf(table) !== -1}
                          onClick={(event) => this.setSelectedTable(table)}>
                    <ListItemText
                        primary={table}
                    />
                    <ListItemSecondaryAction>
                        <Icon>keyboard_arrow_right</Icon>
                    </ListItemSecondaryAction>
                </ListItem>
            );
        })
    }

    render(){
        const {classes, tables} = this.props;
        let {columns, tempValue, checked} = this.state;

        return(
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent className={classes.listCard}>
                            <Typography variant="h6" className={classes.title}>
                                Select Table
                            </Typography>
                            <Scrollbars style={{height: '450px'}}>
                                <List>
                                    {this.renderTableList()}
                                </List>
                            </Scrollbars>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent className={classes.listCard}>
                            <Typography variant="h6" className={classes.title}>
                                Select Fields{(this.state.selectedTable != null) ? ':' +  this.state.selectedTable : ''}
                            </Typography>
                            <Scrollbars style={{height: '450px'}}>
                                {
                                    columns.length > 0 &&
                                    <Grid container direction="row" justify="flex-end"
                                          className={classes.listTitleGrid}>
                                        <Typography variant="body2">Field Type</Typography>
                                    </Grid>
                                }
                                <List>
                                    {this.renderColumnList()}
                                </List>
                            </Scrollbars>
                            <FullBodyLoader active={this.state.loading}/>
                        </CardContent>
                    </Card>
                </Grid>
                <Modal
                    aria-labelledby="credentials-modal"
                    aria-describedby="credentials-fields"
                    disableAutoFocus={true}
                    open={this.state.showCredentials}
                    onClose={this.onEditCredentialClose}>
                    <SelectCredential onCancel={this.onEditCredentialClose} onSubmit={this.handleSubmit} selectedFieldType = {this.state.selectedFieldType} indexTable={this.state.indexTable} clickedColumnIndex={tempValue.idx} checked={checked}/>
                </Modal>
            </Grid>
        );
    }
}

SelectPrimaryTable.propTypes = {
    tables: PropTypes.array.isRequired,
    usedTables: PropTypes.array.isRequired,
    dataTypes: PropTypes.array.isRequired,
    onTableSelect: PropTypes.func.isRequired,
    onColumnSelect: PropTypes.func.isRequired,
    classes: PropTypes.object,
};

export default withStyles(styles)(SelectPrimaryTable);