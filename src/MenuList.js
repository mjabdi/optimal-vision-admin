import DashboardIcon from "@material-ui/icons/Dashboard";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import HistoryIcon from "@material-ui/icons/History";
import TimelineIcon from "@material-ui/icons/Timeline";
import DescriptionIcon from "@material-ui/icons/Description";
import SearchIcon from "@material-ui/icons/Search";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import LiveTvIcon from "@material-ui/icons/LiveTv";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import WarningIcon from "@material-ui/icons/Warning";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import DateRangeIcon from "@material-ui/icons/DateRange";
import EventNoteIcon from "@material-ui/icons/EventNote";
import AirplanemodeActiveIcon from "@material-ui/icons/AirplanemodeActive";
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import CallIcon from '@material-ui/icons/Call';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import SmsIcon from '@material-ui/icons/Sms';
import DraftsIcon from '@material-ui/icons/Drafts';


// OV Admin ----------------
import OVBookingTable from "./OV/BookingTable";
import OVCalendarView from "./OV/calendar-admin/CalendarView";
import PatientsTable from "./OV/PatientsTable";
import EmailTemplstesTable from "./OV/EmailTemplatesTable"
import SMSTemplatesTable from "./OV/SMSTemplatesTable";

//---------------

export const MenuList_OV_Admin = [
  {
    index: 1,
    id: `recentBookings`,
    title: `Recent Bookings`,
    icon: <AutorenewIcon />,
  },
  {
    index: 2,
    id: `todayBookings`,
    title: `Today's Bookings`,
    icon: <NewReleasesIcon />,
  },
  {
    index: 3,
    id: `oldBookings`,
    title: `Old Bookings`,
    icon: <HistoryIcon />,
  },
  {
    index: 4,
    id: `futureBookings`,
    title: `Future Bookings`,
    icon: <TimelineIcon />,
  },
  {
    index: 5,
    id: `allBookings`,
    title: `All Bookings`,
    icon: <DescriptionIcon />,
  },
  {
    index: 6,
    id: `traceBookings`,
    title: `Patients to Trace`,
    icon: <CallIcon />,
  },
  {
    index: 7,
    id: `deletedBookings`,
    title: `Archived Records`,
    icon: <DeleteIcon />,
  },
  {
    index: 8,
    id: `calendarView`,
    title: `Calendar View`,
    icon: <DateRangeIcon />,
  },
  {
    index: 9,
    id: `patientsList`,
    title: `Patients`,
    icon: <AccessibilityIcon />,
  },
  {
    index: 10,
    id: `emailTemplates`,
    title: `Email Templates`,
    icon: <DraftsIcon />,
  },
  {
    index: 11,
    id: `smsTemplates`,
    title: `SMS Templates`,
    icon: <SmsIcon />,
  },

];



export const MenuList_Admin = [
  { index: 0, id: `dashboard`, title: `Dashboard`, icon: <DashboardIcon /> },
  {
    index: 1,
    id: `recentBookings`,
    title: `Recent Bookings`,
    icon: <AutorenewIcon />,
  },
  {
    index: 2,
    id: `todayBookings`,
    title: `Today's Bookings`,
    icon: <NewReleasesIcon />,
  },
  {
    index: 3,
    id: `oldBookings`,
    title: `Old Bookings`,
    icon: <HistoryIcon />,
  },
  {
    index: 4,
    id: `futureBookings`,
    title: `Future Bookings`,
    icon: <TimelineIcon />,
  },
  {
    index: 5,
    id: `allBookings`,
    title: `All Bookings`,
    icon: <DescriptionIcon />,
  },
  {
    index: 6,
    id: `deletedBookings`,
    title: `Deleted Records`,
    icon: <DeleteIcon />,
  },

  {
    index: 7,
    id: `calendarView`,
    title: `Calendar View`,
    icon: <DateRangeIcon />,
  },

  { index: 8, id: `findByRef`, title: `Find By Ref No`, icon: <SearchIcon /> },
];

export const MenuList_Gynae = [
  { index: 0, id: `dashboard`, title: `Dashboard`, icon: <DashboardIcon /> },
  {
    index: 1,
    id: `recentBookings`,
    title: `Recent Bookings`,
    icon: <AutorenewIcon />,
  },
  {
    index: 2,
    id: `todayBookings`,
    title: `Today's Bookings`,
    icon: <NewReleasesIcon />,
  },
  {
    index: 3,
    id: `oldBookings`,
    title: `Old Bookings`,
    icon: <HistoryIcon />,
  },
  {
    index: 4,
    id: `futureBookings`,
    title: `Future Bookings`,
    icon: <TimelineIcon />,
  },
  {
    index: 5,
    id: `allBookings`,
    title: `All Bookings`,
    icon: <DescriptionIcon />,
  },
  {
    index: 6,
    id: `deletedBookings`,
    title: `Deleted Records`,
    icon: <DeleteIcon />,
  },
  {
    index: 7,
    id: `calendarView`,
    title: `Calendar View`,
    icon: <DateRangeIcon />,
  },
  { index: 8, id: `findByRef`, title: `Find By Ref No`, icon: <SearchIcon /> },
];

export const MenuList_GP = [
  { index: 0, id: `dashboard`, title: `Dashboard`, icon: <DashboardIcon /> },
  {
    index: 1,
    id: `recentBookings`,
    title: `Recent Bookings`,
    icon: <AutorenewIcon />,
  },
  {
    index: 2,
    id: `todayBookings`,
    title: `Today's Bookings`,
    icon: <NewReleasesIcon />,
  },
  {
    index: 3,
    id: `oldBookings`,
    title: `Old Bookings`,
    icon: <HistoryIcon />,
  },
  {
    index: 4,
    id: `futureBookings`,
    title: `Future Bookings`,
    icon: <TimelineIcon />,
  },
  {
    index: 5,
    id: `allBookings`,
    title: `All Bookings`,
    icon: <DescriptionIcon />,
  },
  {
    index: 6,
    id: `deletedBookings`,
    title: `Deleted Records`,
    icon: <DeleteIcon />,
  },
  {
    index: 7,
    id: `calendarView`,
    title: `Calendar View`,
    icon: <DateRangeIcon />,
  },
  { index: 8, id: `findByRef`, title: `Find By Ref No`, icon: <SearchIcon /> },
];

export const MenuList_STD = [
  { index: 0, id: `dashboard`, title: `Dashboard`, icon: <DashboardIcon /> },
  {
    index: 1,
    id: `recentBookings`,
    title: `Recent Bookings`,
    icon: <AutorenewIcon />,
  },
  {
    index: 2,
    id: `todayBookings`,
    title: `Today's Bookings`,
    icon: <NewReleasesIcon />,
  },
  {
    index: 3,
    id: `oldBookings`,
    title: `Old Bookings`,
    icon: <HistoryIcon />,
  },
  {
    index: 4,
    id: `futureBookings`,
    title: `Future Bookings`,
    icon: <TimelineIcon />,
  },
  {
    index: 5,
    id: `allBookings`,
    title: `All Bookings`,
    icon: <DescriptionIcon />,
  },
  {
    index: 6,
    id: `deletedBookings`,
    title: `Deleted Records`,
    icon: <DeleteIcon />,
  },
  {
    index: 7,
    id: `calendarView`,
    title: `Calendar View`,
    icon: <DateRangeIcon />,
  },
  { index: 8, id: `findByRef`, title: `Find By Ref No`, icon: <SearchIcon /> },
];

export const MenuList_PCR = [
  { index: 0, id: `dashboard`, title: `Dashboard`, icon: <DashboardIcon /> },
  {
    index: 1,
    id: `recentBookings`,
    title: `Recent Bookings`,
    icon: <AutorenewIcon />,
  },
  {
    index: 2,
    id: `todayBookings`,
    title: `Today's Bookings`,
    icon: <NewReleasesIcon />,
  },
  {
    index: 3,
    id: `liveBookings`,
    title: `Live Bookings`,
    icon: <LiveTvIcon />,
  },
  { index: 4, id: `oldBookings`, title: `Old Bookings`, icon: <HistoryIcon /> },
  {
    index: 5,
    id: `futureBookings`,
    title: `Future Bookings`,
    icon: <TimelineIcon />,
  },
  {
    index: 6,
    id: `allBookings`,
    title: `All Bookings`,
    icon: <DescriptionIcon />,
  },
  {
    index: 7,
    id: `completedBookings`,
    title: `Completed Bookings`,
    icon: <PlaylistAddCheckIcon />,
  },
  {
    index: 8,
    id: `positiveBookings`,
    title: `Positive Results`,
    icon: <AddCircleOutlineIcon />,
  },
  {
    index: 9,
    id: `latebookings`,
    title: `40 Hours Late`,
    icon: <HourglassEmptyIcon />,
  },
  {
    index: 10,
    id: `deletedBookings`,
    title: `Deleted Records`,
    icon: <DeleteIcon />,
  },
  {
    index: 11,
    id: `trBookings`,
    title: `TR Bookings`,
    icon: <AirplanemodeActiveIcon />,
  },
  {
    index: 12,
    id: `unmatchedRecords`,
    title: `Unmatched Records`,
    icon: <WarningIcon />,
  },
  {
    index: 13,
    id: `calendarView`,
    title: `Calendar View`,
    icon: <DateRangeIcon />,
  },
  // {
  //   index: 14,
  //   id: `adminCalendarView`,
  //   title: `Admin Calendar`,
  //   icon: <EventNoteIcon />,
  // },
  { index: 15, id: `findByRef`, title: `Find By Ref No`, icon: <SearchIcon /> },
];

export const getMenuContent = (role, index) => {
   if (role === "ovadmin") {
    switch (index) {
      case 1:
        return <OVBookingTable date="recent" />;
      case 2:
        return <OVBookingTable date="today" />;
      case 3:
        return <OVBookingTable date="old" />;
      case 4:
        return <OVBookingTable date="future" />;
      case 5:
        return <OVBookingTable date="all" />;
      case 6:
        return <OVBookingTable date="trace" />; 
      case 7:
        return <OVBookingTable date="deleted" />;
      case 8:
        return <OVCalendarView />;  
      case 9:
        return <PatientsTable />;  
      case 10:
          return <EmailTemplstesTable />
      case 11:
          return <SMSTemplatesTable />
    
      default:
        return `Page Not Found!`;
    }
  } else {
    return `Page Not Found!`;
  }
};

export const getMenuRole = (role) => {
  switch (role) {
    case "ovadmin":
      return MenuList_OV_Admin;
    default:
      return [];
  }
};

export const getMenuId = (role, index) => {
  const MenuList = getMenuRole(role);
  for (var i = 0; i < MenuList.length; i++) {
    if (MenuList[i].index === index) {
      return MenuList[i].id;
    }
  }

  return `Page Not Found!`;
};

export const getMenuIndex = (role, id) => {
  const MenuList = getMenuRole(role);
  for (var i = 0; i < MenuList.length; i++) {
    if (MenuList[i].id === id) {
      return MenuList[i].index;
    }
  }

  return -1;
};
