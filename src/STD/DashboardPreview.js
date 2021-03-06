import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chart from './Chart';
import CurrentVisits from './CurrentVisits';



import { Tooltip } from '@material-ui/core';
import GlobalState from './../GlobalState';
import BookingView from './BookingView';

const useStyles = makeStyles((theme) => ({
 
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function DashboardPreview() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
        <React.Fragment>

<           Grid container spacing={3}>
                    {/* Chart */}
                    <Grid item xs={12} md={4} lg={6}>
                    <Paper className={fixedHeightPaper}>
                        <Chart />
                    </Paper>
                    </Grid>
                    {/* Current Visits */}
                    <Grid item xs={12} md={4} lg={6}>
                    <Paper className={fixedHeightPaper}>
                        <CurrentVisits />
                    </Paper>
                    </Grid>
                    {/* Recent Bookings */}
                    <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <BookingView/>
                    </Paper>
                    </Grid>
          </Grid>
        </React.Fragment>
  );
}