/**
 * Created by Zihad Ul Islam Mahdi on 9/11/19. Modified on 9/17/19
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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Radio from '@material-ui/core/Radio';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Paper from '@material-ui/core/Paper';

import {FullBodyLoader} from '../../../components/utils';

import {fetchCredentialsByType} from '../../../actions/credentialsAction';

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

class SelectCredential extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTable: '',
            checked: [],
            credentials: [],
            selectedCredential: null,
            selectedIndex: null,
            credentialId: null,
            prevCredentialId: null,
            loading: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRadioSelect = this.handleRadioSelect.bind(this);
    }

    componentDidMount(){
        const {fetchCredentialsByType, selectedFieldType} = this.props;
        const {indexTable, clickedColumnIndex, checked} = this.props;

        const checkedIndex = checked.indexOf(clickedColumnIndex);

        // console.log(indexTable);
        // console.log(checkedIndex);
        
        if(checkedIndex !== -1 && indexTable.columns[checkedIndex]){
            this.setState({
                prevCredentialId: indexTable.columns[checkedIndex].CREDENTIAL
            }, function(){
                fetchCredentialsByType(selectedFieldType);
            });
        }else{
            fetchCredentialsByType(selectedFieldType);

        }
        



    }

    handleRadioSelect(index, credentialId){
        this.setState({
            selectedIndex: index,
            credentialId: credentialId,
            prevCredentialId: null
        });
    }

    handleSubmit(){
        if(this.props.onSubmit){
            this.props.onSubmit(this.state.credentialId);
        }
    }

    renderCredentials(){
        const {tempCredentials, indexTable, columnIndex} = this.props;
        const {prevCredentialId} = this.state;
        const {selectedIndex} = this.state;
        return tempCredentials.map((credential, index) => {
            return(
                <ListItem button key={index} onClick={(event) => this.handleRadioSelect(index, credential._id)}>
                    <ListItemText
                        primary={credential.credentialName}
                    />
                    <ListItemSecondaryAction>
                        <Radio
                            checked={credential._id == prevCredentialId || selectedIndex == index}
                            onChange={(event) => this.handleRadioSelect(index, credential._id)}
                            value={credential.credentialName}
                            name={credential.credentialName}
                            aria-label={credential.credentialName}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            );
        })
    }

    render(){
        const {classes} = this.props;
        const {loading} = this.state;

        return(
            <Paper className={classes.root}>
                <Card style={{width: '100%'}}>
                    <CardContent className={classes.listCard}>
                        <Typography variant="h6" className={classes.title}>
                            Select Credential
                        </Typography>
                        <Scrollbars style={{height: '450px'}}>
                            <List>
                                {this.renderCredentials()}
                            </List>
                        </Scrollbars>
                        <FullBodyLoader active={loading}/>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={this.handleSubmit}>
                            Save
                        </Button>
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
        tempCredentials: store.credentialsInfo.tempCredentials
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchCredentialsByType}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SelectCredential));
