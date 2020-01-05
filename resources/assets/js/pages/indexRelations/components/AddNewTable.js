/**
 * Created by Rajesh on 5/21/19. Modified by Zihad Ul Islam Mahdi on 9/16/19
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import SelectPrimaryTable from "./steps/selectPrimaryTable";
import {SelectSecondaryTable, SelectRelationTable} from './steps';

const styles = theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 752,
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
    margin: {
        margin: theme.spacing(1),
    },
    listCard: {
        padding: 0,
        paddingBottom: '0!important',
        minHeight: 522
    }
});

function getSteps(tables) {
    if(tables.length == 0)
        return ['Select Table and Columns'];
    else
        return ['Select Table and Columns', 'Select Another Table', 'Create Relation Between Tables'];
}

class AddNewTable extends Component{
    constructor(props){
        super(props);

        this.state = {
            steps: [],
            activeStep: 0,
            selectedTable: null,
            selectedColumns: [],
            secondaryTable: null,
            relation: {
                primary: null,
                secondary: null
            }
        };

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.setRelationColumn = this.setRelationColumn.bind(this);
    }

    componentDidMount(){
        const dynamicSteps = getSteps(this.props.usedTables);

        this.setState({
            steps: dynamicSteps
        });
    }

    setRelationColumn(primary=null, secondary=null){
        let tempRelation = this.state.relation;
        if(primary != null) tempRelation.primary = primary;
        if(secondary != null) tempRelation.secondary = secondary;

        this.setState({
            relation: tempRelation
        });
    }

    handleNext = () => {
        const {steps, activeStep, selectedTable, selectedColumns, secondaryTable, relation} = this.state;

        if(activeStep < steps.length - 1) {
            this.setState(state => ({
                activeStep: state.activeStep + 1,
            }));
        }else if(activeStep == steps.length - 1){

            let indexData = {
                tableName: selectedTable,
                columns: selectedColumns,
                secondaryTable: secondaryTable,
                relation: relation
            };
            this.props.onSubmit(indexData);
        }
    };

    handleBack = () => {
        if(this.state.activeStep > 0) {
            this.setState(state => ({
                activeStep: state.activeStep - 1,
            }));
        }
    };

    renderStepper(){
        const { steps, activeStep } = this.state;

        return(
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        );
    }

    renderSteps(){
        const {activeStep, selectedTable, secondaryTable} = this.state;
        const {tables, usedTables} = this.props;

        switch (activeStep){
            case 0:
                return (<SelectPrimaryTable tables={tables} usedTables={usedTables}
                                  dataTypes={this.props.dataTypes}
                                  onTableSelect={(selected) => this.setState({selectedTable:selected})}
                                  onColumnSelect={(selectedList) => this.setState({selectedColumns: selectedList})}/>);
            case 1:
                return (<SelectSecondaryTable usedTables={usedTables} onTableSelect={(selected) => this.setState({secondaryTable: selected})}/>);
            case 2:
                return (<SelectRelationTable primaryTable={selectedTable} secondaryTable={secondaryTable} onColumnSelect={this.setRelationColumn}/>);
            default:
                return (<Typography variant='h5'>Unknown Step Index</Typography>);
        }
    }

    checkForProceed(){
        const {activeStep, selectedColumns, secondaryTable, relation} = this.state;

        switch (activeStep){
            case 0:
                return selectedColumns.length == 0;
            case 1:
                return secondaryTable == null;
            case 2:
                return relation.primary == null || relation.secondary == null;
            default:
                return false;
        }
    }

    renderNavigationButton(){
        const {steps, activeStep} = this.state;

        return(
            <Grid container spacing={2} justify="space-between">
                <Grid item xs={2}>
                    <Button variant="contained" size="medium" color="default" disabled={this.state.activeStep == 0} fullWidth onClick={this.handleBack}>Back</Button>
                </Grid>
                <Grid item xs={4} container spacing={2}>
                    <Grid item xs={6}>
                        <Button size="medium" fullWidth onClick={this.props.onCancel}>Cancel</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" size="medium" color="primary" disabled={this.checkForProceed()} fullWidth onClick={this.handleNext}>
                            {activeStep == steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    render(){
        const {classes} = this.props;

        return(
            <Paper className={classes.root}>
                {this.renderStepper()}
                {this.renderSteps()}
                {this.renderNavigationButton()}
            </Paper>
        );
    }
}

AddNewTable.propTypes = {
    tables: PropTypes.array.isRequired,
    dataTypes: PropTypes.array.isRequired,
    usedTables: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddNewTable);
