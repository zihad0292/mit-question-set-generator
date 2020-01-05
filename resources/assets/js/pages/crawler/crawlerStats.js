/**
 * Created by Rajesh on 7/3/19.
 */

import React, {Component} from 'react';
import TimeAgo from 'javascript-time-ago';
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {fetchCrawlerStats} from '../../actions/crawlerStatsActions';
import {CustomSmallPaper, WidgetTitle, FullBodyLoader} from '../../components/utils';

const styles = theme => ({
    relativeContainer: {
        position: 'relative'
    },
    rootContainer: {
        marginBottom: theme.spacing(4)
    },
    paperRoot: {
        minHeight: 540
    },
    media: {
        height: 150
    },
    cardTitle: {
        height: 55,
        overflow: 'hidden'
    },
    cardActionAlign: {
        justifyContent: 'flex-end'
    }
});

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

class CrawlerStats extends Component{
    constructor(props){
        super(props);

        this.state = {
            fetching: false,
            dbId: null,
            offset: 0
        };

        this.fetchNewData = this.fetchNewData.bind(this);
    }

    componentDidMount(){
        const {dbConfig, crawlerStats, fetchCrawlerStats} = this.props;

        this.setState({dbId: dbConfig._id});

        const thisCrawlerStats = crawlerStats[dbConfig._id];

        if(!thisCrawlerStats || thisCrawlerStats.length == 0) {
            this.fetchNewData(0);
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.fetched && this.props.fetched !== nextProps.fetched && this.state.fetching){
            this.setState({
                fetching: false
            });
        }
    }

    fetchNewData(val){
        const {dbConfig, fetchCrawlerStats} = this.props;
        let tempOffset = this.state.offset + val;

        this.setState({
            fetching: true,
            offset: tempOffset
        });

        fetchCrawlerStats(dbConfig._id, tempOffset);
    }

    renderIndexStats(indexStat){
        const {classes} = this.props;

        return indexStat.map((stat, idx) => {
            return (
                <TableRow key={stat._id}>
                    <TableCell>
                        <Icon fontSize="small">check_box</Icon>
                    </TableCell>
                    <TableCell scope="row">
                        {stat.indexRelationId.name}
                    </TableCell>
                    <TableCell>{stat.tableName}</TableCell>
                    <TableCell align="right">{stat.total}</TableCell>
                    <TableCell align="right">{timeAgo.format(new Date(stat.created_at))}</TableCell>
                </TableRow>
            );
        })
    }

    render(){
         const {classes, dbConfig, crawlerStats} = this.props;
         const {dbId, fetching, offset} = this.state;

         const thisCrawlerStats = crawlerStats[dbId];

         if(thisCrawlerStats && thisCrawlerStats.length > 0) {
             return (
                 <div className={classes.relativeContainer + " " + classes.rootContainer}>
                     <WidgetTitle small>Database Config: {dbConfig.name}</WidgetTitle>
                     <CustomSmallPaper className={classes.paperRoot}>
                         <Table>
                             <TableHead>
                                 <TableRow>
                                     <TableCell/>
                                     <TableCell>Index Relation Name</TableCell>
                                     <TableCell>Table Name</TableCell>
                                     <TableCell align="right">Total</TableCell>
                                     <TableCell align="right">Crawling Time</TableCell>
                                 </TableRow>
                             </TableHead>
                             <TableBody>
                                 {this.renderIndexStats(thisCrawlerStats)}
                             </TableBody>
                         </Table>
                         <CardActions className={classes.cardActionAlign}>
                             <Button size="small" color="primary" variant="outlined"
                                     disabled={offset <= 0} onClick={() => this.fetchNewData(-10)}>
                                 <Icon>navigate_before</Icon>
                                 Previous
                             </Button>
                             <Button size="small" color="primary" variant="outlined"
                                     disabled={thisCrawlerStats.length < 10}
                                     onClick={() => this.fetchNewData(10)}>
                                 Next
                                 <Icon>navigate_next</Icon>
                             </Button>
                         </CardActions>
                     </CustomSmallPaper>
                     <FullBodyLoader active={fetching}/>
                 </div>
             );
         } else {
             return(
                 <div>
                     <WidgetTitle small>Database Config: {dbConfig.name}</WidgetTitle>
                     <CustomSmallPaper className={classes.paperRoot}>
                         {fetching && <FullBodyLoader active={fetching}/>}
                         {!fetching &&
                         <Grid container direction="row" justify="center"
                                             alignItems="center" className={classes.paperRoot}>
                             <Typography variant="h6" align="center">No Stats Found</Typography>
                         </Grid>
                         }
                     </CustomSmallPaper>
                 </div>
             );
        }
    }
}

function mapStateToProps(store) {
    return {
        crawlerStats: store.crawlerStatsInfo.crawlerStats,
        fetched : store.crawlerStatsInfo.fetched
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchCrawlerStats}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CrawlerStats));
