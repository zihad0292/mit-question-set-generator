/**
 * Created by Rajesh on 6/13/19. Modified by Zihad Ul Islam Mahdi on 8/20/19.
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';

import {addNewOffice, fetchOfficeList, updateOfficeInfo} from '../../actions/officeActions';
import {CustomSmallPaper, FlatButton} from '../../components/utils';

const styles = theme => ({
    tableTitle: {
        margin: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    cardContent: {
        padding: theme.spacing(0,2)
    },
    submitButton: {
        margin: theme.spacing(2, 0),
        padding: theme.spacing(1.5)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    }
});


class AddNewForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            location: '',
            showMessage: false
        };
        this.populateStateVal = this.populateStateVal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const {type} = this.props;
        
        if(type == 'update'){
            this.populateStateVal();
        }
    }
    
    populateStateVal(){
        const {selectedOffice} = this.props;
        
        this.setState({
            name: selectedOffice.name,
            location: selectedOffice.location,
            showMessage: true
        });
    }
    
    componentWillReceiveProps(nextProps){
        if((this.props.added != nextProps.added && nextProps.added) || (this.props.updated != nextProps.updated && nextProps.updated)){
            this.props.fetchOfficeList();
            // console.log(nextProps);
            this.setState({
                name: '',
                location: ''
            });
        }
        if(this.props.onComplete){
            this.props.onComplete();
        }
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(){
        const {name, location} = this.state;
        const {type, selectedOffice, addNewOffice, updateOfficeInfo} = this.props;

        if(name.length > 0){
            if(type == 'update'){
                updateOfficeInfo(selectedOffice._id, name, location);
            }else {
                addNewOffice(name, location);
            }
        }
    }

    render(){
        const {classes, adding, updating, type} = this.props;

        return(
            <CustomSmallPaper>
                <div className={classes.cardContent}>
                    <TextField
                        required
                        id="office-name"
                        name="name"
                        label="Office Name"
                        value={this.state.name}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={this.handleChange}
                    />
                    <TextField
                        required
                        id="office-location"
                        name="location"
                        label="Office location"
                        value={this.state.location}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={this.handleChange}
                    />
                    <FlatButton variant="contained" color="primary"
                                disabled={adding || updating} className={classes.submitButton}
                                size='large' fullWidth onClick={this.handleSubmit}>
                        {type === 'update' ? 'Update' : 'Save'}
                        <Icon className={classes.rightIcon}>save</Icon>
                    </FlatButton>
                </div>
            
            </CustomSmallPaper>
        );
    }
}

AddNewForm.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['add', 'update']),
    selectedDbConfig: PropTypes.object,
    onComplete: PropTypes.func
};

function mapStateToProps(store) {
    return {
        added : store.officeInfo.added,
        adding: store.officeInfo.adding,
        updating: store.officeInfo.updating,
        updated: store.officeInfo.updated,
        offices: store.officeInfo.offices,
        userType: store.userInfo.type,
        office: store.userInfo.office_id,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addNewOffice, fetchOfficeList, updateOfficeInfo }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddNewForm));