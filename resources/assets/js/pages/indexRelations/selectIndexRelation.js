/**
 * Created by Zihad Ul Islam Mahdi on 9/17/19. 
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { Scrollbars } from 'react-custom-scrollbars';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Paper from '@material-ui/core/Paper';

import {FullBodyLoader} from '../../components/utils';

import {fetchIndexRelations} from '../../actions/indexRelationActions';

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

class SelectIndexRelation extends Component{
    constructor(props){
        super(props);
        this.state = {
            indexRelation: [],
        };

    }

    componentDidMount(){
        const {fetchIndexRelations} = this.props;
        fetchIndexRelations(this.props.dbConfig);
    }

    renderIndexRelations(){
        const {indexRelations} = this.props;

        return indexRelations.map((indexRelation, index) => {
            return(
                <ListItem button key={index} onClick={(event) => this.props.onSelect(indexRelation._id)}>
                    <ListItemText
                        primary={indexRelation.name}
                    />
                </ListItem>
            );
        })
    }

    render(){
        const {classes, fetching, fetched} = this.props;

        return(
            <Paper className={classes.root}>
                <Card style={{width: '100%'}}>
                    <CardContent className={classes.listCard}>
                        <Typography variant="h6" className={classes.title}>
                            Select IndexRelation
                        </Typography>
                        <Scrollbars style={{height: '450px'}}>
                            <List>
                                {this.renderIndexRelations()}
                            </List>
                        </Scrollbars>
                        <FullBodyLoader active={fetching}/>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={() => {
                            if(this.props.onCancel){
                                this.props.onCancel();
                            }
                        }}>
                            Cancel
                        </Button>
                    </CardActions>
                </Card>
            </Paper>
        );
    }
}



function mapStateToProps(store) {
    return{
        indexRelations: store.indexRelationInfo.indexRelations,
        fetching      : store.indexRelationInfo.fetching,
        fetched       : store.indexRelationInfo.fetched,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchIndexRelations}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SelectIndexRelation));
