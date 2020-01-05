/**
 * Created by Rajesh on 5/22/19.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Scrollbars } from 'react-custom-scrollbars';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Radio from '@material-ui/core/Radio';

import {FullBodyLoader} from '../../../../components/utils';

import {getAllColumns} from '../../../../actions/indexRelationActions';

const styles = theme => ({
    tableButton: {
        height: '100%',
        minHeight: 180,
        display: 'block'
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
    }
});

class SecondaryTableClass extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTable: null
        };

        this.handleTableClick = this.handleTableClick.bind(this);
    }

    handleTableClick(tableName){
        this.setState({
            selectedTable: tableName
        }, () => this.props.onTableSelect(tableName));
    }

    render(){
        const {classes} = this.props;
        const {selectedTable} = this.state;

        const usedTableItems = this.props.usedTables.map((table, idx) => {
            return(
                <Grid item xs={4} key={idx}>
                    <Button size='large' variant="contained"
                            color={selectedTable == table ? 'primary' : 'default'}
                            onClick={() => this.handleTableClick(table)}
                            fullWidth className={classes.tableButton}>{table}</Button>
                </Grid>
            );
        });

        return(
            <Grid container spacing={2}>
                {usedTableItems}
            </Grid>
        );
    }
}

SecondaryTableClass.propTypes = {
    usedTables: PropTypes.array.isRequired,
    onTableSelect: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

class SelectRelationClass extends Component{
    constructor(props){
        super(props);
        this.state = {
            primaryColumnList: [],
            secondaryColumnList: [],
            selectedPrimaryCol: null,
            selectedSecondaryCol: null,
            loading: false
        };

        this.fetchTableColumn = this.fetchTableColumn.bind(this);
        this.handlePrimaryRadioSelect = this.handlePrimaryRadioSelect.bind(this);
        this.handleSecondaryRadioSelect = this.handleSecondaryRadioSelect.bind(this);
    }

    fetchTableColumn(stateVar, tableName){
        this.setState({loading: true});

        getAllColumns(tableName).then((res) => {
            if(res.success){

                const fieldsWithTypeId = res.results.filter((field) => {
                    if(field.COLUMN_NAME.includes('id')){
                        return field;
                    }
                });

                this.setState({
                    [stateVar]: fieldsWithTypeId,
                    loading: false
                });
            }
        })
    }

    componentDidMount(){
        const {primaryTable, secondaryTable} = this.props;

        this.fetchTableColumn('primaryColumnList', primaryTable);
        this.fetchTableColumn('secondaryColumnList', secondaryTable);
    }

    handlePrimaryRadioSelect(val){
        const {onColumnSelect} = this.props;
        const {primaryColumnList} = this.state;

        this.setState({
            selectedPrimaryCol: val
        }, () => onColumnSelect(primaryColumnList[val].COLUMN_NAME, null));
    }

    handleSecondaryRadioSelect(val){
        const {onColumnSelect} = this.props;
        const {secondaryColumnList} = this.state;

        this.setState({
            selectedSecondaryCol: val
        }, () => onColumnSelect(null, secondaryColumnList[val].COLUMN_NAME));
    }

    renderSecondaryColumn(){
        const {secondaryColumnList, selectedSecondaryCol} = this.state;
        return secondaryColumnList.map((column, index) => {
            return(
                <ListItem button key={index} onClick={(event) => this.handleSecondaryRadioSelect(index)}>
                    <ListItemText
                        primary={column.COLUMN_NAME}
                        secondary={column.COLUMN_TYPE}
                    />
                    <ListItemSecondaryAction>
                        <Radio
                            checked={selectedSecondaryCol == index}
                            onChange={(event) => this.handleSecondaryRadioSelect(index)}
                            value={index}
                            name={column.COLUMN_NAME}
                            aria-label={column.COLUMN_NAME}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            );
        })
    }

    renderPrimaryColumn(){
        const {primaryColumnList, selectedPrimaryCol} = this.state;

        return primaryColumnList.map((column, index) => {
            return(
                <ListItem button key={index} onClick={(event) => this.handlePrimaryRadioSelect(index)}>
                    <ListItemText
                        primary={column.COLUMN_NAME}
                        secondary={column.COLUMN_TYPE}
                    />
                    <ListItemSecondaryAction>
                        <Radio
                            checked={selectedPrimaryCol == index}
                            onChange={(event) => this.handlePrimaryRadioSelect(index)}
                            value={index}
                            name={column.COLUMN_NAME}
                            aria-label={column.COLUMN_NAME}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            );
        })
    }

    render(){
        const {primaryTable, secondaryTable, classes} = this.props;

        return(
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent className={classes.listCard}>
                            <Typography variant="h6" className={classes.title}>
                                {primaryTable}
                            </Typography>
                            <Scrollbars style={{height: '450px'}}>
                                <List dense>
                                    {this.renderPrimaryColumn()}
                                </List>
                            </Scrollbars>
                            <FullBodyLoader active={this.state.loading}/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent className={classes.listCard}>
                            <Typography variant="h6" className={classes.title}>
                                {secondaryTable}
                            </Typography>
                            <Scrollbars style={{height: '450px'}}>
                                <List dense>
                                    {this.renderSecondaryColumn()}
                                </List>
                            </Scrollbars>
                            <FullBodyLoader active={this.state.loading}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

SelectRelationClass.propTypes = {
    primaryTable: PropTypes.string.isRequired,
    secondaryTable: PropTypes.string.isRequired,
    onColumnSelect: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

const SelectSecondaryTable = withStyles(styles)(SecondaryTableClass);
const SelectRelationTable = withStyles(styles)(SelectRelationClass);

export {SelectSecondaryTable, SelectRelationTable};
