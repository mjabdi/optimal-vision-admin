import React, { useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import dateformat from 'dateformat';
import BookService from './services/BookService';
import { LinearProgress } from '@material-ui/core';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}


const emptyData = [
  createData('09:00', 0),
  createData('10:00', 0),
  createData('11:00', 0),
  createData('12:00', 0),
  createData('13:00', 0),
  createData('14:00', 0),
  createData('15:00', 0),
  createData('16:00', 0),
  createData('17:00', 0),
  createData('18:00', undefined),

];

const getCount = (data, str) =>
{
  if (!data)
    return 0;

  var count = 0;
  for (var i=0; i < data.length; i++)
  {
    if (data[i]._id.substr(0,2) === str)
    {
      count += data[i].count;
    }
  }
  return count;
}

export default function Chart() {
  const theme = useTheme();

  const [data, setData] = React.useState(emptyData);
  const [loading, setLoading] = React.useState(false)

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      const todayStr = dateformat(new Date(), 'yyyy-mm-dd');
      var result = [];
      try
      {
          setLoading(true)
          const res = await BookService.getBookingsStatsByDateStr(todayStr);
          setLoading(false)
          const data = res.data.result;
          result.push(createData('09:00', getCount(data,'09')));
          result.push(createData('10:00', getCount(data,'10')));
          result.push(createData('11:00', getCount(data,'11')));
          result.push(createData('12:00', getCount(data,'12')));
          result.push(createData('13:00', getCount(data,'13')));
          result.push(createData('14:00', getCount(data,'14')));
          result.push(createData('15:00', getCount(data,'15')));
          result.push(createData('16:00', getCount(data,'16')));
          result.push(createData('17:00', getCount(data,'17')));
          result.push(createData('18:00', undefined));
 
           setData(result);
      }
      catch(err){
        setLoading(false)
        console.error(err);
      }

    }
  
   fetchData();

  }, [] );

  return (
    <React.Fragment>
       {loading && (
        <div style={{ width: "100%", paddingTop: "3px" }}>
          <LinearProgress color="primary" />
        </div>
      )}
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Online Bookings
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}