/**
 * Created by Rajesh on 6/15/19.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

import IntegrationReactSelect from '../../components/IntegrationReactSelect';

import {addNewDBConfig, fetchDBConfigList, updateDBConfig, checkDbConfigConnection} from '../../actions/dbConfigActions';
import {CustomSmallPaper, FlatButton} from '../../components/utils';

const styles = theme => ({
    tableTitle: {
        margin: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    submitButton: {
        margin: theme.spacing(2, 0),
        padding: theme.spacing(1.5)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    },
    connectionMessage: {
        display: 'inline-flex',
        alignItems: 'center',
        color: theme.palette.error.main,
        marginLeft: 5
    },
    connectionMessageSuccess: {
        color: theme.palette.secondary.light,
    }
});

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

SingleValue.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
};

function ValueContainer(props) {
    return <div>{props.children}</div>;
}

ValueContainer.propTypes = {
    children: PropTypes.node
};

class AddNewDB extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            host: '',
            port: '',
            user: '',
            pass: '',
            dbName: '',
            token: '',
            selectedOffice: null,
            enable: true,
            frequency: 10,
            connection: {
                status: false,
                checking: false,
                checked: false,
                message: ""
            }
        };

        this.populateStateVal = this.populateStateVal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleCheckConnection = this.handleCheckConnection.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const {type} = this.props;
        console.log(this.state)
        if(type == 'update'){
            this.populateStateVal();
        }
    }

    populateStateVal(){
        const {selectedDbConfig, offices} = this.props;

        this.setState({
            name: selectedDbConfig.name,
            host: selectedDbConfig.host,
            port: selectedDbConfig.port,
            user: selectedDbConfig.user,
            pass: selectedDbConfig.password,
            dbName: selectedDbConfig.dbName,
            token: selectedDbConfig.token,
            enable: selectedDbConfig.enable,
            frequency: selectedDbConfig.frequency
        },()=>{
            for(var i=0; i<offices.length; i++){
                if(this.state.token && this.state.token == offices[i].primary_key) {
                    this.setState({
                        selectedOffice:{
                            value: offices[i].primary_key,
                            label: offices[i].name
                        }
                    });
                }
            }
        });
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.added || nextProps.updated){
            if(this.props.userType == 'admin') {
                this.props.fetchDBConfigList(nextProps.token);
            } else{
                this.props.fetchDBConfigList()
            }

            this.setState({
                name: '',
                host: '',
                port: '',
                user: '',
                pass: '',
                dbName: '',
                token: '',
                selectedOffice:null,
                enable: true,
                frequency: 10,
                connection: {
                    status: false,
                    checking: false,
                    checked: false,
                    message: ""
                }
            });

            if(this.props.onComplete){
                this.props.onComplete();
            }
        }
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleCheckboxChange(event){
        this.setState({
            [event.target.name]: event.target.checked
        });
    }

    handleCheckConnection(){
        const {host, port, user, pass, dbName, connection} = this.state;

        let tempConn = connection;
        tempConn.checking = true;

        this.setState({connection: tempConn});

        checkDbConfigConnection(host, port, user, pass, dbName).then((resp) => {
                if(resp.success){
                    tempConn = {
                        status: true,
                        checking: false,
                        checked: true,
                        message: "Connection Established"
                    };

                    this.setState({connection: tempConn});
                }else{
                    tempConn = {
                        status: false,
                        checking: false,
                        checked: true,
                        message: "Connection Failed"
                    };

                    this.setState({connection: tempConn});
                }
            });
    }

    handleSubmit(){
        const {name, host, port, user, pass, dbName, token, enable, frequency} = this.state;
        const {type, selectedDbConfig, addNewDBConfig, updateDBConfig} = this.props;

        if(name.length > 0){
            if(type == 'update'){
                updateDBConfig(selectedDbConfig._id, name, host, port, user, pass, dbName, token, enable, frequency);
            }else {
                addNewDBConfig(name, host, port, user, pass, dbName, token, enable, frequency);
            }
        }
    }

    renderCheckConnectionButton(){
        const {classes} = this.props;
        const {connection} = this.state;

        const messageIcon = () => {
            return (
                <div className={`${classes.connectionMessage} ${connection.status ? classes.connectionMessageSuccess : ''}`}>
                    <Icon>{connection.status ? 'done' : 'error'}</Icon>
                    <Typography variant="body2">{connection.message}</Typography>
                </div>
            );
        };

        return(
            <Grid container direction="row" justify="flex-start" alignItems="center" style={{marginTop: '7px'}}>
                <Button size="small" variant="outlined" color="secondary"
                        disabled={this.state.host.length == 0 || this.state.port.length == 0}
                        onClick={this.handleCheckConnection}>
                    Verify Connection
                </Button>
                {connection.checking && <CircularProgress color="secondary" size={20}/>}
                {connection.checked && messageIcon()}
            </Grid>
        );
    }

    render(){
        const {classes, adding, offices, updating, type} = this.props;

        const {token} = this.state;

        let officeList = offices.map(office => {
            return {
                value: office.primary_key,
                label: office.name,
            };
        });

        return(
            <CustomSmallPaper>
                <CardContent>
                    <form id="new-db-form" name="new-db-form" onSubmit={this.handleSubmit}>
                        <IntegrationReactSelect suggestions={officeList} label="office"
                                                selected={this.state.selectedOffice}
                                                onChange={(val) => {
                                                    this.setState({
                                                        selectedOffice: {value: val.value, label: val.label},
                                                        token: val.value
                                                    })
                                                }}/>
                        <TextField
                            required
                            id="config-name" name="name" label="Configuration Name" value={this.state.name}
                            margin="normal" variant="outlined" fullWidth
                            onChange={this.handleChange}
                        />

                        <TextField
                            required
                            id="db-name" name="dbName" label="Database Name" value={this.state.dbName}
                            margin="normal" variant="outlined" fullWidth
                            onChange={this.handleChange}
                        />

                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <TextField
                                    required
                                    id="db-host" name="host" label="Database Host" value={this.state.host}
                                    margin="normal" variant="outlined" fullWidth
                                    onChange={this.handleChange}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    required
                                    id="db-port" name="port" label="Port" value={this.state.port}
                                    margin="normal" variant="outlined" fullWidth
                                    onChange={this.handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} alignItems='center'>
                            <Grid item xs={6}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox name="enable" checked={this.state.enable} onChange={this.handleCheckboxChange} value={this.state.enable} />}
                                        label="Enabled"
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    id="db-port" name="frequency" label="Interval in minutes" value={this.state.frequency}
                                    margin="normal" variant="outlined" fullWidth type="number"
                                    onChange={this.handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    id="db-user" name="user" label="Database User" value={this.state.user}
                                    margin="normal" variant="outlined" fullWidth
                                    onChange={this.handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    id="db-pass" name="pass" type="password" label="Password" value={this.state.pass}
                                    margin="normal" variant="outlined" fullWidth
                                    onChange={this.handleChange}
                                />
                            </Grid>
                        </Grid>
                        {this.renderCheckConnectionButton()}
                        <FlatButton variant="contained" color="primary"
                                    disabled={adding || updating} className={classes.submitButton}
                                    size='large' fullWidth onClick={this.handleSubmit}>
                            {type === 'update' ? 'Update' : 'Save'}
                            <Icon className={classes.rightIcon}>save</Icon>
                        </FlatButton>
                    </form>
                    <Typography variant="subtitle2">*It is recommended to have read only access of the database user.</Typography>
                </CardContent>
            </CustomSmallPaper>
        );
    }
}

AddNewDB.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['add', 'update']),
    selectedDbConfig: PropTypes.object,
    onComplete: PropTypes.func
};

function mapStateToProps(store) {
    return {
        added : store.dbConfigInfo.added,
        adding: store.dbConfigInfo.adding,
        updating: store.dbConfigInfo.updating,
        updated: store.dbConfigInfo.updated,
        token: store.dbConfigInfo.token,
        offices: store.officeInfo.offices,
        userType: store.userInfo.type,
        office: store.userInfo.office_id,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addNewDBConfig, fetchDBConfigList, updateDBConfig}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddNewDB));
