/**
 * Created by Zihad Ul Islam Mahdi on 9/2/19
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import {WidgetTitle, FullBodyLoader} from '../../../components/utils';

import AddNewCredential from './addNewCredential';

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
});

class UpdateCredential extends Component{
    constructor(props){
        super(props);
        this.onComplete = this.onComplete.bind(this);
    }

    onComplete(){
        this.props.onUpdateComplete();
    }

    render(){
        const {classes} = this.props;
        return(
            <Paper className={classes.root}>
                <WidgetTitle>Update Credential Info</WidgetTitle>
                <AddNewCredential type='update' selectedData={this.props.selectedData} onComplete={this.onComplete}/>
            </Paper>
        );
    }
}

UpdateCredential.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedData: PropTypes.object.isRequired,
    onUpdateComplete: PropTypes.func.isRequired
};

export default withStyles(styles)(UpdateCredential);
