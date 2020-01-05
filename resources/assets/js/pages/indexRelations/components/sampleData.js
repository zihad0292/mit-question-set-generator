/**
 * Created by Rajesh on 5/26/19.
 */

import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Scrollbars } from 'react-custom-scrollbars';
import {executeSqlQuery} from '../../../actions/indexRelationActions';

import {WidgetTitle, CustomSmallPaper} from '../../../components/utils';

const styles = theme => ({
    root: {
        margin: theme.spacing(3, 0),
    },
    paper: {
        overflowX: 'auto',
        margin: theme.spacing(2, 0),
    },
    evenRow: {
        backgroundColor: '#f5f5f5'
    },
    headerMargin: {
        margin: theme.spacing(2, 0)
    }
});


class SampleData extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: []
        };

        this.handleFetchButton = this.handleFetchButton.bind(this);
    }

    handleFetchButton(){
        let {query} = this.props;
        query = query + " LIMIT 10";

        executeSqlQuery(query).then((res) => {
            if(res.success){
                this.setState({
                    data: res.results
                });
            }
        })
    }

    renderTableHeads(){
        const {data} = this.state;

        if(data.length > 0) {
            const firstRow = data[0];
            return Object.keys(firstRow).map((column, idx) => {
                return (
                    <TableCell key={idx}>{column}</TableCell>
                );
            });
        }
    }

    renderTableRows(){
        const {data} = this.state;
        const {classes} = this.props;

        return data.map((row, idx) => {
            const cells = Object.keys(row).map((column, idx) => {
                return(
                    <TableCell key={idx}>
                        {row[column]}
                    </TableCell>
                );
            });

            return(
                <TableRow key={idx} className={idx%2 == 0 ? classes.evenRow : ''}>
                    {cells}
                </TableRow>
            )
        })
    }

    render(){
        const {classes} = this.props;

        return(
            <div className={classes.root}>
                <Grid container direction="row" justify="space-between" className={classes.headerMargin}>
                    <WidgetTitle small>Check Index Relation</WidgetTitle>
                    <Button variant="text" color="primary" className={classes.button} onClick={this.handleFetchButton}>
                        Fetch Data
                    </Button>
                </Grid>
                <CustomSmallPaper>
                    <Scrollbars autoHeight autoHeightMax={1200}>
                        <Table className={classes.table} size="small">
                            <TableHead>
                                <TableRow className={classes.headerMargin}>
                                    {this.renderTableHeads()}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.renderTableRows()}
                            </TableBody>
                        </Table>
                    </Scrollbars>
                </CustomSmallPaper>
            </div>
        );
    }
}

export default withStyles(styles)(SampleData);
