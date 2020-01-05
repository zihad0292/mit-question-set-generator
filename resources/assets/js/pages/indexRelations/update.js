/**
 * Created by Rajesh on 6/26/19. Modified By Mahdi on 22/9/19
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import {MessagePopUp} from '../../components/messagePopUps';

import {findIndexById} from '../../actions/indexRelationActions';
import {FlatButton, PageContainer, WidgetTitle, CustomSmallPaper, FullBodyLoader} from '../../components/utils';
import {clearIndexRelationMessage} from '../../actions/indexRelationActions';
import CreateIndex from './components';

const styles = theme => ({});

class UpdateIndex extends Component {

    constructor(props) {
        super(props);
        this.state = {
            indexId : null,
            message: '',
            showMessage: false
        };

        this.handleMessageClose = this.handleMessageClose.bind(this);
    }

    componentDidMount(){
        const indexId = this.props.match.params.index;
        this.setState({
            indexId: indexId
        });

        this.props.findIndexById(indexId);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.message && nextProps.message.length > 0){
            this.setState({
                message: nextProps.message,
                showMessage: true
            });
        }
    }

    handleMessageClose(){
        this.setState({
            showMessage: false
        }, function(){
            this.props.clearIndexRelationMessage();
        })
        
    }

    render(){
        const {finding, updating} = this.props;
        return(
            <PageContainer maxWidth="lg">
                <WidgetTitle>
                    Update Index Relation
                </WidgetTitle>
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{position: 'relative'}}>
                        <CreateIndex type="edit"/>
                        <FullBodyLoader active={finding || updating}/>
                    </Grid>
                </Grid>
                <MessagePopUp visible={this.state.showMessage} variant='success' onClose={this.handleMessageClose} message={this.state.message}/>
            </PageContainer>
        );
    }
}

UpdateIndex.propTypes = {
    classes: PropTypes.object.isRequired
};

function mapStateToProps(store) {
    return {
        selected: store.indexRelationInfo.selected,
        finding: store.indexRelationInfo.finding,
        found : store.indexRelationInfo.found,
        updating: store.indexRelationInfo.updating,
        dbconfig: store.indexRelationInfo.dbconfig,
        message: store.indexRelationInfo.message
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({findIndexById, clearIndexRelationMessage}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UpdateIndex));
