import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Title from "./Title";
import PCRBookService from "./PCR/services/BookService";

import GlobalState from "./GlobalState";
import { Grid, LinearProgress } from "@material-ui/core";

import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";

const useStyles = makeStyles((theme) => ({
  countLabel: {
   position: "absolute",
   top: "65px",
   left: "44%",
   fontSize: "3rem",
  },

  countLabelRed: {
    position: "absolute",
    top: "65px",
    left: "44%",
    fontSize: "3rem",
    color: theme.palette.secondary.main
   },

   Icon: {
    fontSize: "2rem"

  },

  IconRed: {
   fontSize: "2rem",
  //  color: theme.palette.secondary.main,
  },

  TitleRed:{
    // color: theme.palette.secondary.main,
  }


}));

export default function LateBookingView() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);

  const [data, setData] = React.useState(null);

  const [refresh, setRefresh] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const loadData = async () => {
    setLoading(true);

    try {
      const res = await PCRBookService.getLateBookings();

      setData(res.data.length);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refresh]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setRefresh((refresh) => !refresh);
    }, 30000);

    return () =>
    {
      clearInterval(interval)
    }
  }, []);

  return (
    <React.Fragment>
      <div style={{ position: "relative" }}>
        {loading && (
          <div style={{ width: "100%", paddingTop: "3px" }}>
            <LinearProgress color="primary" />
          </div>
        )}
        <Title>
          <Grid
            container
            direction="row-reverse"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <div style={{ paddingTop: "5px" }}>
                <HourglassEmptyIcon className={data === 0 ? classes.Icon : classes.IconRed } />
              </div>
            </Grid>
            <Grid item style={{ textAlign: "left" }}>
              <span className={data === 0 ? classes.Title : classes.TitleRed}>
                  PCR 40-Hours Late
              </span>
           
            </Grid>
          </Grid>

          {data !== null && <div className={data === 0 ? classes.countLabel : classes.countLabelRed }>{data}</div>}
        </Title>
      </div>
    </React.Fragment>
  );
}
