/**
 * Created by Rajesh on 7/16/19.
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {fetchDBConfigList, setDBConfigToken} from '../../actions/dbConfigActions';
import {fetchOfficeList} from '../../actions/officeActions';
import {fetchIndexRelations} from '../../actions/indexRelationActions';
import {setDbConfig, setIndexRelation, searchToApi, paramsToApi} from '../../actions/indexSearchActions';

import IntegrationReactSelect from '../../components/IntegrationReactSelect';
import {PageContainer, CustomSmallPaper, WidgetTitle, FlatButton} from '../../components/utils';

const styles = theme => ({
    searchInput: {
        marginTop: 0
    },
    buttonStyle: {
        height: 55,
        marginTop: -12
    },
    resultContainer:{
        marginTop: theme.spacing(2)
    },
    listStyle: {
        padding: 0
    },
    fragmentStyle: {
        color: 'rgba(0,0,0,0.55)',
        fontSize: 14,
        maxHeight: 60,
        overflow: 'hidden'
    },
    oddRow: {
        backgroundColor: '#f5f5f5'
    },
    wordBreakStyle: {
        wordBreak: 'break-all'
    }
});

class SearchPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            query: ''
        };

        this.onDbConfigSelect = this.onDbConfigSelect.bind(this);
        this.onIndexRelationSelect = this.onIndexRelationSelect.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
    }

    componentDidMount(){
        const {offices, dbConfigs, userType, office, fetchOfficeList} = this.props;

        if(dbConfigs.length == 0 && userType !== 'admin'){
            this.props.fetchDBConfigList();
        }

        if(offices.length == 0){
            if(userType == 'admin') {
                fetchOfficeList(office);
            }else{
                fetchOfficeList();
            }
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.offices.length == 0 && nextProps.offices.length > 0) {

            if(nextProps.userType == 'admin'){
                const token = nextProps.offices[0].primary_key;
                this.props.setDBConfigToken(token);
            }
        }

        if(this.props.token != nextProps.token && this.props.userType == 'admin'){
            this.props.fetchDBConfigList(nextProps.token);
        }
    }

    onDbConfigSelect(val){
        const configDB = this.props.dbConfigs[val.value];
        const {_id} = configDB;

        this.props.setDbConfig(_id);
        this.props.fetchIndexRelations(_id);
    }

    onIndexRelationSelect(val){
        this.props.setIndexRelation(val.value);
    }

    handleInputChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onSearchClick(){
        const {searchToApi, paramsToApi, indexRelation} = this.props;

        let query = SearchPage.searchFormatter(this.state.query);

        if(typeof query === 'object'){
            paramsToApi(indexRelation, query);
        }else {
            searchToApi(indexRelation, query);
        }
    }

    renderResults(){
        const {results, classes} = this.props;

        return Object.keys(results).map((item, idx) => {
            const resultObject = results[item];
            const properties = Object.keys(resultObject).map((resultProps, propIdx) => {
                return(
                    <Grid container key={`listItem-${propIdx}`} alignItems="center" spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" key={`ListText-${propIdx}`} className={classes.wordBreakStyle}>
                                {resultProps} :
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={`${classes.fragmentStyle} ${classes.wordBreakStyle}`}
                                  dangerouslySetInnerHTML={{ __html: resultObject[resultProps]}} />
                        </Grid>
                    </Grid>
                );
            });

            return(
                <React.Fragment key={idx}>
                    {idx !== 0 && <Divider component="li" />}
                    <ListItem className={idx%2 == 1 ? classes.oddRow : ''}>
                        <ListItemText primary={properties}/>
                    </ListItem>
                </React.Fragment>
            );
        })
    }


    render(){
        const {dbConfigs, dbConfig, indexRelations, fetched, indexRelation, classes, total} = this.props;

        let selectedDb = null;
        let selectedIndex = null;

        const dbConfigList = dbConfigs.map((config, idx) => {
            if(dbConfig && dbConfig == config._id){
                selectedDb = {
                    value: idx,
                    label: config.dbName,
                }
            }

            return {
                value: idx,
                label: config.dbName,
            };
        });

        const indexList = indexRelations.map((index, idx) => {
            if(indexRelation && indexRelation == index._id){
                selectedIndex = {
                    value: index._id,
                    label: index.name
                };
            }

            return{
                value: index._id,
                label: index.name
            }
        });

        return(
            <PageContainer maxWidth="lg">
                <WidgetTitle>Search Here</WidgetTitle>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6} sm={4}>
                        <IntegrationReactSelect suggestions={dbConfigList}
                                                onChange={this.onDbConfigSelect}
                                                selected={selectedDb}
                                                label="Database List"/>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <IntegrationReactSelect suggestions={indexList}
                                                onChange={this.onIndexRelationSelect}
                                                selected={selectedIndex}
                                                label="Index Relation List"/>
                    </Grid>
                    <Grid item xs={12} sm={4}/>
                    <Grid item xs={9} sm={6}>
                        <TextField
                            required
                            id="query"
                            name="query"
                            label="Enter query to search"
                            value={this.state.query}
                            margin="normal"
                            variant="outlined"
                            fullWidth className={classes.searchInput}
                            onChange={this.handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={3} sm={2}>
                        <FlatButton fullWidth color="primary" variant="contained"
                                    className={classes.buttonStyle}
                                    disabled={selectedIndex == null || this.state.query.length == 0}
                                    onClick={this.onSearchClick}>Search</FlatButton>
                    </Grid>
                </Grid>
                <Grid container spacing={2} className={classes.resultContainer}>
                    {
                        total > 0 &&
                        <Grid item sm={8} xs={12}>
                            <WidgetTitle small>Total {total} results found</WidgetTitle>
                            <CustomSmallPaper>
                                <List className={classes.listStyle}>
                                    {this.renderResults()}
                                </List>
                            </CustomSmallPaper>
                        </Grid>
                    }
                    {
                        total == 0 && fetched &&

                        <Grid item sm={8} xs={12}>
                            <WidgetTitle small>No results found on this Index</WidgetTitle>
                        </Grid>
                    }
                </Grid>
            </PageContainer>
        )
    }
}

SearchPage.searchFormatter = function (searchString) {
    const pattern = /[^{\}]+(?=})/g;

    let extractedParams = searchString.match(pattern);

    if(extractedParams && extractedParams.length > 0){
        let paramsObject = {};
        extractedParams.map((paramString) => {
            let splitted = paramString.split(":");
            paramsObject[splitted[0].trim()] = splitted[1].trim();
        });

        return paramsObject;
    }

    return searchString;
};

function mapStateToProps(store) {
    return {
        ...store.indexSearchInfo,
        dbConfigs: store.dbConfigInfo.dbConfigs,
        indexRelations: store.indexRelationInfo.indexRelations,
        token: store.dbConfigInfo.token,
        userType: store.userInfo.type,
        offices: store.officeInfo.offices,
        office: store.userInfo.office_id,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({setDbConfig, setIndexRelation, searchToApi, paramsToApi, fetchDBConfigList, setDBConfigToken, fetchOfficeList, fetchIndexRelations}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SearchPage));
