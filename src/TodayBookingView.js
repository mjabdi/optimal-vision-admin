import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import PCRBookService from "./PCR/services/BookService";
import GynaeBookService from "./Gynae/services/BookService";
import GPBookService from "./GP/services/BookService";
import STDBookService from "./STD/services/BookService";

import * as dateformat from "dateformat";
import { LinearProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
}));

export default function TodayBookingView() {
  const classes = useStyles();
  
  const [data, setData] = React.useState(null);

  const [refresh, setRefresh] = React.useState(false);

  const [loading, setLoading] = React.useState(false);


  const loadData = async () => {
    setLoading(true);

    const today = dateformat(new Date(), 'yyyy-mm-dd')
    try{
      const res1 = await PCRBookService.getAllBookingsCountByDateStr(today)
      const res2 = await GynaeBookService.getAllBookingsCountByDateStr(today)
      const res3 = await GPBookService.getAllBookingsCountByDateStr(today)
      const res4 = await STDBookService.getAllBookingsCountByDateStr(today)
      
      const pcr =  parseInt(res1.data.count)
      const gynae = parseInt(res2.data.count)
      const gp = parseInt(res3.data.count)
      const std = parseInt(res4.data.count)

      const _data = [
        {clinic: "PCR", count: pcr},
        {clinic: "Gynae", count: gynae},
        {clinic: "GP", count: gp},
        {clinic: "STD", count: std},
        {clinic: "Total", count: pcr+gynae+gp+std}
      ]
      setData(_data)

      setLoading(false);
    }
    catch(err)
    {
      console.error(err)
      setLoading(false)
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
      {loading && (
        <div style={{ width: "100%", paddingTop: "3px" }}>
          <LinearProgress color="primary" />
        </div>
      )}
      <Title>Today Bookings</Title>
      {data && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Clinic</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.clinic}</TableCell>
                <TableCell>{row.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </React.Fragment>
  );
}
