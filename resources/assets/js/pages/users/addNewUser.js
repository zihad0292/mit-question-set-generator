/**
 * Created by Rajesh on 6/18/19. Modified by Zihad Ul Islam Mahdi on 8/21/19.
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';

import IntegrationReactSelect from '../../components/IntegrationReactSelect';

import {fetchOfficeList} from '../../actions/officeActions';
import {fetchUserList, addNewUser} from '../../actions/usersListActions';
import {CustomSmallPaper, FlatButton} from '../../components/utils';

const styles = theme => ({
    submitButton: {
        margin: theme.spacing(2, 0),
        padding: theme.spacing(1.5)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    }
});

class AddNewUser extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            pass: '',
            confirm: '',
            type: 'admin',
            officeName: '',
            officeId: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        if(this.props.offices.length == 0){
            this.props.fetchOfficeList();
        }

    }
    
    componentWillReceiveProps(nextProps){
        if((this.props.added != nextProps.added && nextProps.added) || (this.props.deleted != nextProps.deleted && nextProps.deleted)){
            this.props.fetchUserList();
            this.setState({
                email: '',
                pass: '',
                confirm: '',
                type: 'admin',
                officeName: '',
                officeId: ''
            });
        }

    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(e){
        const {email, pass, confirm, type, officeName, officeId} = this.state;
        const { addNewUser } = this.props;

        if(pass == confirm && pass.length > 0){
            addNewUser(email, pass, type, officeName, officeId);
        }

    }

    render(){
        const {classes, adding, offices} = this.props;

        const officeList = offices.map(office => ({
            value: office._id,
            label: office.name,
        }));

        const userType = [
            {value: 'admin', label: 'Admin'},
            {value: 'super-admin', label: 'Super Admin'}
        ];

        return(
            <CustomSmallPaper>
                <CardContent>
                    <form noValidate autoComplete="off" id="new-user-form" name="new-user-form" onSubmit={this.handleSubmit}>
                        <IntegrationReactSelect suggestions={officeList} label="office"
                                                onChange={(val) => this.setState({
                                                    officeName: val.label,
                                                    officeId: val.value
                                                })}/>
                        <TextField
                            required
                            id="user-email"
                            name="email"
                            label="User email"
                            type="email"
                            value={this.state.email}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            onChange={this.handleChange}
                        />
                        <IntegrationReactSelect suggestions={userType} label="User Type"
                                                onChange={(val) => this.setState({
                                                    type: val.value
                                                })}/>
                        <TextField
                            required
                            id="user-password"
                            name="pass"
                            label="User password"
                            type="password"
                            value={this.state.pass}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            onChange={this.handleChange}
                        />
                        <TextField
                            required
                            id="user-confirm"
                            name="confirm"
                            label="Confirm password"
                            type="password"
                            value={this.state.confirm}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            onChange={this.handleChange}
                        />
                        <FlatButton variant="contained" color="primary"
                                    disabled={adding} className={classes.submitButton}
                                    size='large' fullWidth onClick={this.handleSubmit}>
                                    Save
                            <Icon className={classes.rightIcon}>save</Icon>
                        </FlatButton>
                    </form>
                </CardContent>
            </CustomSmallPaper>
        );
    }
}

AddNewUser.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedUser: PropTypes.object,
    onComplete: PropTypes.func
};

function mapStateToProps(store) {
    return {
        added : store.userListInfo.added,
        adding: store.userListInfo.adding,
        deleting : store.userListInfo.deleting,
        deleted: store.userListInfo.deleted,
        offices: store.officeInfo.offices
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUserList, addNewUser, fetchOfficeList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddNewUser));
