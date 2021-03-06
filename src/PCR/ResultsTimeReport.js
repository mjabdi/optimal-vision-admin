import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import { Dialog, DialogContent, DialogTitle, Grid, LinearProgress, Link, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core';
import BookService from './services/BookService';

import {
    PieChart, Pie, Sector, Cell,
  } from 'recharts';

  const COLORS = ['#00b33e', '#0070e0', '#bb00c4'];

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index,
  }) => {
     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fontSize="14px" fontWeight="500" fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${value} `}
      </text>
    );
  };


const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },

  ReportLabels: {
      position: "absolute",
      top : "80px",
      left: "0px"
  },

  AverageLabel: {
    position: "absolute",
    top : "190px",
    right: "30px",
    fontSize : "12px",
    color : "#0070e0",
    fontWeight: "600",
  },

  less12Label: {
      fontSize : "12px",
      color : "#00b33e",
      fontWeight: "600",
      paddingLeft : "5px",
      borderLeft: "5px solid #00b33e",
      marginBottom : "10px",
  },

  less24Label: {
    fontSize : "12px",
    color : "#0070e0",
    fontWeight: "600",
    paddingLeft : "5px",
    borderLeft: "5px solid #0070e0",
    marginBottom : "10px",
    },

less36Label: {
    fontSize : "12px",
    color : "#bb00c4",
    fontWeight: "600",
    paddingLeft : "5px",
    borderLeft: "5px solid #bb00c4",
    marginBottom : "10px",
    },

    seeMore :{
        position: "absolute",
        top : "191px",
        left : "2px"
    }

});


export default function ResultsTimeReport() {
  const classes = useStyles();

  const[current, setCurrent] = React.useState(new Date());
  const [report, setReport] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const [data, setData] = React.useState(null);

  const [loading, setLoading] = React.useState(false)

  const handleClose = () =>
  {
      setOpen(false);
  }

  useEffect(() => 
  {
    const interval = setInterval(() => {  
      setCurrent(new Date());
    }, 30000);

    return () =>
    {
      clearInterval(interval);
    }

  }, []);

  useEffect( () => 
  {
    
    setLoading(true)
    BookService.getTestsTimeReport().then(res =>
      {
        const result = [];  
        setLoading(false)
        if (res.data.status === 'OK')
        {
            setReport(res.data.result);
            // console.log(res.data.result);
            result.push({name: 'lessThan12', value : res.data.result.lessThan12 });
            result.push({name: 'lessThan24', value : res.data.result.lessThan24 });
            result.push({name: 'lessThan36', value : res.data.result.lessThan36 });
         
           // result.push({name: 'lessThan48', value : res.data.result.lessThan48 });
            setData(result);
        }   

      }).catch(err =>
        {
          setLoading(false)
          console.error(err);
        });


    } , [] );

    const getReportLabels = () =>
    {
           return (

                <div className={classes.ReportLabels}>
                    <div className={classes.less12Label}> {`12 Hours`} </div>
                    <div className={classes.less24Label}> {`24 Hours`} </div>
                    <div className={classes.less36Label}> {`36 Hours`} </div>
                </div>
    
            );
    }

    const getAverageLabel = () =>
    {
           return (

                <div className={classes.AverageLabel}>
                   avg = <span style={{fontSize:"14px"}}> {`${report.avg}`} </span> hours
                </div>
    
            );
    }

    const seeMoreClicked = (event) => {
        event.preventDefault();
        setOpen(true);
      }

  return (
    <React.Fragment>
    
    <div style={{position: "relative"}}>
    {loading && (
        <div style={{ width: "100%", paddingTop: "3px" }}>
          <LinearProgress color="primary" />
        </div>
      )}

      <Title>PCR RESULTS SUMMARY</Title>

      {data && (
                <>

                <PieChart width={250} height={150}>
                    <Pie
                        data={data}
                        cx={170}
                        cy={70}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={65}
                        fill="#8884d8"
                        dataKey="value"
                        >
                        {
                            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                        }
                    </Pie>
                </PieChart>
                

                {getReportLabels()}
                {getAverageLabel()}

                <div className={classes.seeMore}>
                            <Link color="primary" href="#" onClick={seeMoreClicked}>
                                  See Details
                            </Link>
                  </div>


                  <Dialog style={{padding: "50px"}} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>  
                      <DialogTitle style={{textAlign: "center"}} id="simple-dialog-title">PCR Results Time Report</DialogTitle>
                            <DialogContent>
                            <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell>Recieved in Less Than</TableCell>        
                                <TableCell>Count</TableCell>
                                <TableCell>Percent</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key="row1">
                                    <TableCell>12 Hours</TableCell>
                                    <TableCell>{report.lessThan12}</TableCell>
                                    <TableCell>{report.lessThan12Percent} %</TableCell>
                                </TableRow>
                                <TableRow key="row2">
                                    <TableCell>24 Hours</TableCell>
                                    <TableCell>{report.lessThan24}</TableCell>
                                    <TableCell>{report.lessThan24Percent} %</TableCell>
                                </TableRow>
                                <TableRow key="row3">
                                    <TableCell>36 Hours</TableCell>
                                    <TableCell>{report.lessThan36}</TableCell>
                                    <TableCell>{report.lessThan36Percent} %</TableCell>
                                </TableRow>
                                <TableRow key="row4">
                                    <TableCell>48 Hours</TableCell>
                                    <TableCell>{report.lessThan48}</TableCell>
                                    <TableCell>{report.lessThan48Percent} %</TableCell>
                                </TableRow>
                                <TableRow key="row4">
                                    <TableCell style={{fontWeight:"800"}}>Total Results Received : </TableCell>
                                    <TableCell style={{fontWeight:"600"}}>{report.lessThan48 + report.lessThan36 + report.lessThan24 + report.lessThan12}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>



                            
                            </TableBody>
                        </Table>
                            </DialogContent>
                </Dialog>
    



                </>
      )}
     
     </div>



    </React.Fragment>
  );
}