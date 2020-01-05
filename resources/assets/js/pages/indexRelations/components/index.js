/**
 * Created by Rajesh on 11/26/18. Modified by Zihad Ul Islam Mahdi on 9/15/19
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Modal from '@material-ui/core/Modal';

import {getAllTablesList, addNewIndex, updateIndexRelation, findIndexById, fetchIndexRelations} from '../../../actions/indexRelationActions';
import {fetchDataTypes} from '../../../actions/dataTypesActions';
import {FlatButton, CustomSmallPaper, ConfirmDialog} from '../../../components/utils';
import {MessagePopUp} from '../../../components/messagePopUps';
import AddTable from './AddNewTable';
import EditColumns from './editColumns';
import SampleDataViewer from './sampleData';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: '750px',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    media: {
        height: 180
    },
    cardChip: {
        margin: theme.spacing(0.5)
    },
    title: {
        padding: theme.spacing(2, 1),
        color: 'white',
        position: 'absolute',
        bottom: 145
    },
    cardContent: {
        height: 80,
        overflow: 'hidden'
    },
    addButton: {
        height: '100%',
        minHeight: 256,
        display: 'block',
        color: theme.palette.text.secondary,
    },
    actionButton: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    gridSpacing: {
        margin: theme.spacing(2, 0)
    }
});


class CreateIndex extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showMessage: false,
            showModal: false,
            showColumnList: false,
            name: '',
            enabled: true,
            dbID: '',
            indexId: '',
            tableList: [],
            indexTables: [],
            selectedTable: null,
            showEditColumn: false,
            query: '',
            redirect: false,
            confirm: false,
            message: null,
        };

        this.onModalClose = this.onModalClose.bind(this);
        this.onModalSubmit = this.onModalSubmit.bind(this);
        this.onEditColumnSubmit = this.onEditColumnSubmit.bind(this);
        this.generateQuery = this.generateQuery.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggleIndexStatus =  this.toggleIndexStatus.bind(this);
        this.onEditIndexTableClick = this.onEditIndexTableClick.bind(this);
        this.saveIndexRelation = this.saveIndexRelation.bind(this);
        this.renderIndexTables = this.renderIndexTables.bind(this);
        this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
        this.onEditColumnClose = this.onEditColumnClose.bind(this);
    }

    componentDidMount(){
        const {dataTypes, fetchDataTypes} = this.props;

        getAllTablesList().then((res) => {
            if(res.success){
                this.setState({tableList: res.results});
            }
        });

        this.setState({
            dbID: this.props.match.params.dbConfig
        });

        if(dataTypes.length == 0){
            fetchDataTypes();
        }
    }

    componentWillReceiveProps(nextProps){

        if(!this.props.added && nextProps.added){
            this.props.fetchIndexRelations(this.state.dbID);
            this.setState({
                redirect: true
            });
        }else if(!this.props.updated && nextProps.updated){
            this.props.findIndexById(nextProps.selected._id);
        }


        if((nextProps.selected && nextProps.type == "edit") || nextProps.SelectedIndexRelation){
            const tempIndexTables = nextProps.selected.indexTables;

            let modifiedIndex = tempIndexTables.map((index) => {
                let modColumns = index.columns.map((column) => {
                    return {
                        COLUMN_NAME: column.name,
                        COLUMN_TYPE: column.type,
                        FIELD_TYPE: column.field,
                        CREDENTIAL: column.credential
                    };
                });

                return {
                    tableName: index.table,
                    secondaryTable: index.secondary,
                    relation: index.relation,
                    columns: modColumns
                };
            });

            this.setState({
                name: nextProps.selected.name,
                query: nextProps.selected.query,
                enabled: nextProps.selected.enable,
                dbID: nextProps.selected.dbConfigId,
                indexTables: modifiedIndex
            });

            if(nextProps.SelectedIndexRelation){
                this.setState({
                    name: ''
                });
            }
        }
    }

    onModalClose(){
        this.setState({
            showModal: false,
            showColumnList: false
        });
    }

    onEditColumnClose(){
        this.setState({
            selectedTable: null
        });
    }
    
    onDeleteClick(idx){
        this.setState({
            showEditColumn: false,
            confirm: true,
            selectedTable: idx
        });
    }

    onDeleteSubmit(){
        const {indexTables, selectedTable} = this.state;
        const selectedData = indexTables[selectedTable];

        let tempIndexTables = indexTables;
        let haveRelation = false;
        let tempMessage = null;

        indexTables.map((table) => {
            if(selectedData.tableName == table.secondaryTable){
                haveRelation = true;
            }
        });

        if(!haveRelation){
            tempIndexTables.splice(selectedTable, 1);
        }else{
            tempMessage = "This table has one or more relations with other tables. Can not be deleted";
        }

        this.setState({
            confirm: false,
            showMessage: haveRelation,
            indexTables: tempIndexTables,
            message: tempMessage
        }, this.generateQuery);
    }

    handleInputChange(event){
        //console.log(event.target.value);

        this.setState({
            [event.target.name]: event.target.value
        });
    }

    toggleIndexStatus(event){
        this.setState({
            enabled: !this.state.enabled
        });
    }

    onEditIndexTableClick(indexTableId){
        this.setState({
            showEditColumn: true,
            showColumnList: true,
            selectedTable: indexTableId
        });
    }

    saveIndexRelation(){
        const {name, enabled, dbID, indexTables, query} = this.state;
        const {selected, type, updateIndexRelation, addNewIndex} = this.props;

        let modifiedIndexes = indexTables.map((index) => {
            let modColumns = index.columns.map((column) => {
                return {
                    name: column.COLUMN_NAME,
                    type: column.COLUMN_TYPE,
                    field: column.FIELD_TYPE,
                    credential: column.CREDENTIAL,
                };
            });

            return {
                table: index.tableName,
                secondary: index.secondaryTable,
                relation: index.relation,
                columns: modColumns
            };
        });

        if(type == "edit"){
            updateIndexRelation(selected._id, name, enabled, query, dbID, JSON.stringify(modifiedIndexes));
        }else {
            addNewIndex(name, enabled, query, dbID, JSON.stringify(modifiedIndexes))
        }
    }

    generateQuery(){
        const {indexTables} = this.state;

        let selectedColumns = [];
        let primaryTable = null;
        let innerJoins = [];

        indexTables.forEach((table, idx) => {
            table.columns.forEach((column) => {
                selectedColumns.push(table.tableName + "." + column.COLUMN_NAME);
            });

            if(idx == 0){
                primaryTable = table.tableName;
            }else{
                const {tableName, relation, secondaryTable} = table;
                innerJoins.push(`INNER JOIN ${tableName} ON ${tableName}.${relation.primary}=${secondaryTable}.${relation.secondary}`);
            }
        });

        let generatedSql = `SELECT ${selectedColumns.join(',')} FROM ${primaryTable} ${innerJoins.join(' ')}`;

        this.setState({
            query: generatedSql
        });
    }

    onModalSubmit(indexTableData){
        let tempTables = this.state.indexTables;
        tempTables.push(indexTableData);
        this.setState({
            indexTables: tempTables,
            showModal: false
        }, this.generateQuery);
    }

    onEditColumnSubmit(newIndexTable){
        let {indexTables, selectedTable} = this.state;

        indexTables[selectedTable] = newIndexTable;
        this.setState({
            indexTables: indexTables,
            showColumnList: false,
            selectedTable: null
        }, () => this.generateQuery());

    }

    renderIndexTables(){
        const {classes} = this.props;
        let {indexTables} = this.state;

        return indexTables.map((table, index) => {

            let columnList = table.columns.map((item, idx) => {
                return(
                    <Chip label={item.COLUMN_NAME} key={idx} className={classes.cardChip} />
                );
            });

            return(
               <Grid item sm={6} xs={12} key={index}>
                   <CustomSmallPaper>
                       <CardMedia
                           className={classes.media}
                           image="/images/index-relation-tables.png"
                           title={table.tableName}
                       />
                       <Typography variant="h6" align="left" className={classes.title}>{table.tableName}</Typography>
                       <CardContent className={classes.cardContent}>
                           {columnList}
                       </CardContent>
                       <CardActions>
                           <Button size="small" color="primary" onClick={()=>this.onEditIndexTableClick(index)}>
                               Edit
                           </Button>
                           <Button size="small" color="primary" onClick={() => this.onDeleteClick(index)}>
                               Delete
                           </Button>
                       </CardActions>
                   </CustomSmallPaper>
               </Grid>
            );
        });
    }

    render(){
        const { classes, adding, history, dataTypes } = this.props;
        const {indexTables, name, enabled, redirect, selectedTable, query, showMessage, message, showEditColumn, showUpdateMessage, updateMessage} = this.state;
        if(redirect){
            return(
                <Redirect to="/dashboard/index_relation"/>
            )
        }

        let selectedTables = indexTables.map((table) => table.tableName);

        return(
            <div>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                        <Typography variant="subtitle1" component="p">
                            Index Relation Name
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            id="index-name"
                            name="name"
                            label="Enter an unique name"
                            value={this.state.name}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            onChange={this.handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox name="enabled" checked={enabled} onChange={this.toggleIndexStatus} value={enabled} />
                            }
                            label="Enabled"
                            labelPlacement="start"
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        <Grid container spacing={2} className={classes.gridSpacing}>
                            {this.renderIndexTables()}
                            <Grid item sm={6} xs={12}>
                                <Button size='large' onClick={() => this.setState({showModal: true})} fullWidth className={classes.addButton}>
                                    <Icon>add_circle</Icon>
                                    <br/>
                                    <Typography variant="h6">Add New Table</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={5}>
                        {selectedTable != null && showEditColumn === true && <EditColumns indexTable={indexTables[selectedTable]} selectedTable={selectedTable} onCancel={this.onEditColumnClose} onSubmit={this.onEditColumnSubmit}/>}
                    </Grid>
                </Grid>
                
                <Modal
                    aria-labelledby="table-list-modal"
                    aria-describedby="table-list-with-fields"
                    disableAutoFocus={true}
                    open={this.state.showModal}
                    onClose={this.onModalClose}>
                    <AddTable tables={this.state.tableList} usedTables={selectedTables} dataTypes={dataTypes} onCancel={this.onModalClose} onSubmit={this.onModalSubmit}/>
                </Modal>

                <Grid container direction="row">
                    <FlatButton variant="contained"
                                color="primary"
                                disabled={adding || name.length == 0 || indexTables.length == 0}
                                className={classes.actionButton}
                                onClick={this.saveIndexRelation}>Save Index Relation</FlatButton>
                    <FlatButton
                        onClick={() => history.push('/dashboard/index_relation/')}
                        className={classes.actionButton}>Cancel</FlatButton>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {query.length > 0 && <SampleDataViewer query={query}/>}
                    </Grid>
                </Grid>

                <ConfirmDialog title="Confirm Delete?"
                               description="Do you really want to delete this Index Table? This means you can not Index Data from this index table."
                               active={this.state.confirm} onClose={() => this.setState({confirm: false})}
                               onSubmit={this.onDeleteSubmit} />
                <MessagePopUp visible={showMessage} variant='error' onClose={() => this.setState({showMessage: false})} message={message}/>
            </div>
        )
    }

}

CreateIndex.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['new', 'edit'])
};

function mapStateToProps(store) {
    return {
        ...store.indexRelationInfo,
        dataTypes: store.dataTypesInfo.dataTypes
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addNewIndex, updateIndexRelation, findIndexById, fetchDataTypes, fetchIndexRelations}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(CreateIndex)));
