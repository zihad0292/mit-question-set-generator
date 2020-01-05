/**
 * Created by Rajesh on 5/28/19.
 */


import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import {FlatButton, CustomPaper} from '../../components/utils';

import {MessagePopUp} from '../../components/messagePopUps';
import {submitLoginInfo} from '../../actions/userActions';

const styles = theme => ({
    button: {
        marginTop: theme.spacing(2),
        width: '50%'
    },
    loginBackground: {
        position: 'absolute',
        width: '100%',
        height: '50%',
        backgroundColor: theme.palette.primary.main,
        zIndex: '-1',
        top: 0
    },
    loginContainer: {
        maxWidth: 900
    },
    loginImage: {
        width: '100%'
    },
    loader: {
        position: 'relative',
        top: 15,
        left: 15
    },
    paper: {
        padding: theme.spacing(3, 2),
        paddingRight: theme.spacing(5)
    },
});

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showMessage: false,
            isAuthenticated: false,
            message: '',
            fetching: false,
            fetched: false,
            values: {
                email: '',
                password: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMessageClose = this.handleMessageClose.bind(this);
    }

    componentWillReceiveProps(nextProps){

        const showPops = nextProps.message && nextProps.message.length > 0;


        this.setState({
            isAuthenticated: nextProps.isLoggedIn,
            message: nextProps.message,
            fetching: nextProps.fetching,
            fetched: nextProps.fetched,
            showMessage: showPops
        });
    }

    handleMessageClose(){
        this.setState({
            showMessage: false
        })
    }

    handleSubmit(e){
        e.preventDefault();
        const {email, password} = this.state.values;

        if(email.length > 3 && password.length > 3){
            this.props.submitLoginInfo(email, password);
        }
    }

    handleChange(event, name){
        const {values} = this.state;
        let tempValues = {...values, [name]: event.target.value};

        this.setState({ values: tempValues });
    };

    render(){

        const {values, isAuthenticated, showMessage, message, fetching} = this.state;
        const {classes} = this.props;

        if(isAuthenticated){
            return(
                <Redirect push to="/dashboard/"/>
            );
        }

        return(
            <Grid container direction="row" justify="center" alignItems="center" className="full-height">
                <div className={classes.loginBackground}/>
                <Grid item className={classes.loginContainer}>
                    <CustomPaper>
                        <Grid container>
                            <Grid item sm={6} xs={12}>
                                <img src="/images/login.jpg" className={classes.loginImage}/>
                            </Grid>
                            <Grid item sm={6} xs={12} className={classes.paper}>
                                <Typography variant="h5">Welcome</Typography>
                                <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                                    <TextField
                                        id="outlined-name"
                                        label="Email"
                                        type="email"
                                        value={values.email}
                                        onChange={(e) => this.handleChange(e, 'email')}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="username"
                                    />
                                    <TextField
                                        id="password"
                                        type="password"
                                        label="Password"
                                        value={values.password}
                                        onChange={(e) => this.handleChange(e, 'password')}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="current-password"
                                    />
                                    <FlatButton type="submit"
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            className={classes.button}
                                            disabled={fetching}
                                            onClick={this.handleSubmit}>Login</FlatButton>
                                    {fetching ? <CircularProgress size={30} color="secondary" className={classes.loader}/> : ''}
                                </form>
                            </Grid>
                        </Grid>
                    </CustomPaper>
                </Grid>
                <MessagePopUp visible={showMessage} variant={isAuthenticated ? 'success' : 'error'} onClose={this.handleMessageClose} message={message}/>
            </Grid>
        )
    }
}

function mapStateToProps(store) {
    return store.userInfo;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ submitLoginInfo }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));