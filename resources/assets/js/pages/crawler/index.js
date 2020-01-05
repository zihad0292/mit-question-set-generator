/**
 * Created by Rajesh on 7/3/19.
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MaterialTable, {MTableToolbar} from 'material-table';
import TimeAgo from 'javascript-time-ago';
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';

import IntegrationReactSelect from '../../components/IntegrationReactSelect';

import {fetchOfficeList} from '../../actions/officeActions';
import {fetchDBConfigList, setDBConfigToken} from '../../actions/dbConfigActions';
import {fetchCrawlerStats} from '../../actions/crawlerStatsActions';
import {PageContainer, FullBodyLoader, WidgetTitle, CustomSmallPaper} from '../../components/utils';

//import CrawlerStat from './crawlerStats';

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

const styles = theme => ({
    relativeContainer: {
        position: 'relative',
        minHeight: 540
    },
    listTitle: {
        marginTop: theme.spacing(2)
    },
    toolbarStyle: {
        backgroundImage: "url('/images/crawler-stats-banner.png')",
        minHeight: 140,
        backgroundSize: 'cover'
    }
});

class Crawler extends Component{
    constructor(props){
        super(props);

        this.state = {
            dbId: '',
            dbLabel: '',
            currentPage: 0
        };

        this.onDbConfigSelect = this.onDbConfigSelect.bind(this);
        this.fetchCrawlingStats = this.fetchCrawlingStats.bind(this);
    }

    componentDidMount(){
        const {offices, dbConfigs, userType, office, fetchOfficeList} = this.props;

        if(dbConfigs.length == 0 && userType !== 'admin') {
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
        this.props.fetchCrawlerStats(val.value);

        this.setState({
            dbId: val.value,
            dbLabel: val.label,
            currentPage: 0
        });

        //this.fetchCrawlingStats({page: 0, pageSize: 10});
    }

    fetchCrawlingStats(query){
        console.log(query);
        return new Promise((resolve, reject) => {
            if(this.state.dbId.length > 0) {
                let url = '/api/stats/crawler/list?db=' + this.state.dbId + '&offset=' + query.page * query.pageSize;
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        resolve({
                            data: data.results,
                            page: query.page,
                            totalCount: 210,
                        })
                    })
            }else{
                resolve({
                    data: [],
                    page: 0,
                    totalCount: 0,
                })
            }
        })
    }

    renderStatsTable(){
        const {classes, crawlerStats, fetchCrawlerStats, total} = this.props;
        const {dbId, currentPage} = this.state;

        const columns = [
            {title: 'Index Name', field: 'indexRelationId.name', sorting: false },
            {title: 'Table Name', field: 'tableName', sorting: false },
            {title: 'Total Indexed', field: 'total', sorting: false, type: 'numeric' },
            {
                title: 'Crawled At',
                field: 'created_at' ,
                render: (rowData) => {
                    return (
                        <Typography variant="body2" component="p">
                            {rowData.created_at ? timeAgo.format(new Date(rowData.created_at)) : 'Not Available'}
                        </Typography>
                    );
                }
            },
        ];

        const components = {
            Toolbar: props => (
                <div className={classes.toolbarStyle}>
                    <MTableToolbar {...props} />
                </div>
            ),
            Container: props => {
                return (
                    <CustomSmallPaper style={props.style}>{props.children}</CustomSmallPaper>
                )
            },
            Pagination: props => (
                <TablePagination
                    rowsPerPageOptions={[10]}
                    count={total}
                    rowsPerPage={10}
                    page={currentPage}
                    onChangePage={(e, page) => {
                        fetchCrawlerStats(dbId, page*10);
                        this.setState({
                            currentPage: page
                        })
                    }}
                />
            )
        };

        const options= {
            showTitle: false,
            searchFieldStyle: {
                color: "#fff"
            },
            pageSize: 10,
        };


        return (
            <MaterialTable
                columns={columns} data={crawlerStats}
                components={components} options={options}
            />
        );

    }

    render(){
        const {classes, dbConfig, dbConfigs, fetching, dbConfigFetching} = this.props;

        let selectedDb = null;

        const dbConfigList = dbConfigs.map((config, idx) => {
            if(dbConfig && dbConfig == config._id) {
                selectedDb = {
                    value: config._id,
                    label: config.dbName,
                };
            }

            return{
                value: config._id,
                label: config.dbName,
            };
        });

        return(
            <PageContainer maxWidth="lg" className = {classes.relativeContainer}>
                <WidgetTitle>Crawler Statistics Page</WidgetTitle>
                <Grid container spacing={2}>
                    <Grid item sm={8} xs={12}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="subtitle1" component="p">
                                    Select Database
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <IntegrationReactSelect suggestions={dbConfigList}
                                                        onChange={this.onDbConfigSelect}
                                                        selected={selectedDb}
                                                        label="Database List" disabled={dbConfigFetching}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <WidgetTitle small className={classes.listTitle}>Crawler Stats</WidgetTitle>
                <Grid container>
                    <Grid item xs={12}>
                        {this.renderStatsTable()}
                    </Grid>
                </Grid>

                <FullBodyLoader active={dbConfigFetching || fetching}/>
            </PageContainer>
        );
    }
}

function mapStateToProps(store) {
    return {
        ...store.crawlerStatsInfo,
        token: store.dbConfigInfo.token,
        dbConfigs: store.dbConfigInfo.dbConfigs,
        dbConfigFetching: store.dbConfigInfo.fetching,
        userType: store.userInfo.type,
        offices: store.officeInfo.offices,
        office: store.userInfo.office_id,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchOfficeList, fetchDBConfigList, setDBConfigToken, fetchCrawlerStats}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Crawler));



