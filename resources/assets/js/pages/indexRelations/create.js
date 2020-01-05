/**
 * Created by Rajesh on 6/26/19.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import {findIndexById} from '../../actions/indexRelationActions';
import {FlatButton, PageContainer, WidgetTitle, CustomSmallPaper, FullBodyLoader} from '../../components/utils';
import Modal from '@material-ui/core/Modal';
import CreateIndex from './components';
import SelectIndexRelation from './selectIndexRelation';

const styles = theme => ({
    alignRight: {
        textAlign: 'right'
    },
    searchButton: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(1)
    },
});

class UpdateIndex extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showExistingRelations: false
        };
        this.onModalClose = this.onModalClose.bind(this);
        this.onIndexRelationSelect = this.onIndexRelationSelect.bind(this);
    }

    componentDidMount(){
        
    }

    onIndexRelationSelect(indexRelationId){
        this.setState({
            showExistingRelations: false
        });
        this.props.findIndexById(indexRelationId);
    }

    onModalClose(){
        this.setState({
            showExistingRelations: false
        });
    }


    render(){
        const {adding, classes} = this.props;
        return(
            <PageContainer maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}>
                        <WidgetTitle>
                            Create Index Relation
                        </WidgetTitle>
                    </Grid>
                    <Grid item xs={12} sm={3} className={classes.alignRight}>
                        <FlatButton variant="contained" color="primary"
                                        className={classes.searchButton}
                                        size='small' fullWidth={false} onClick={()=>this.setState({showExistingRelations: true})}>
                            Copy existing
                        </FlatButton>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{position: 'relative'}}>
                        <CreateIndex SelectedIndexRelation={this.props.selected}/>
                        <FullBodyLoader active={adding}/>
                    </Grid>
                </Grid>
                <Modal
                    aria-labelledby="indexRelations-modal"
                    aria-describedby="indexRelations"
                    disableAutoFocus={true}
                    open={this.state.showExistingRelations}
                    onClose={this.onModalClose}>
                    <SelectIndexRelation dbConfig={this.props.dbConfig} onCancel={this.onModalClose} onSelect={this.onIndexRelationSelect}/>
                </Modal>
            </PageContainer>
        );
    }
}

UpdateIndex.propTypes = {
    classes: PropTypes.object.isRequired
};

function mapStateToProps(store) {
    return {
        adding   : store.indexRelationInfo.adding,
        added    : store.indexRelationInfo.added,
        dbConfig : store.indexRelationInfo.dbConfig,
        selected : store.indexRelationInfo.selected
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({findIndexById}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UpdateIndex));
