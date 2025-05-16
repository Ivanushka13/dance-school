import React from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Admins from "./Pages/Lists/Admins";
import Students from "./Pages/Lists/Students";
import Home from "./Pages/Home/Home";
import LoginPage from "./Pages/Login/Login";
import EventsList from "./Pages/Lists/Events"
import GroupsList from "./Pages/Lists/Groups";
import ClassroomsList from "./Pages/Lists/Classrooms";
import TeachersList from "./Pages/Lists//Teachers";
import Profile from "./Pages/Profile/Profile";
import LessonsList from "./Pages/Lists/Lessons";
import LevelsList from "./Pages/Lists/Levels";
import EventTypesList from "./Pages/Lists/EventTypes";
import SubscriptionsList from "./Pages/Lists/Subscriptions";
import PaymentsList from "./Pages/Lists/Payments";
import PaymentTypesList from "./Pages/Lists/PaymentTypes";
import EditPage from './Pages/EditPage/EditPage';
import SlotsList from "./Pages/Lists/Slots";
import DanceStylesList from "./Pages/Lists/DanceStyles";
import SubscriptionTemplatesList from "./Pages/Lists/SubscriptionTemplates";
import LessonTypes from "./Pages/Lists/LessonTypes";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {ru} from 'date-fns/locale';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import ScrollToTop from "./util/ScrollToTop";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Router future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
        <ScrollToTop/>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>

          <Route element={<ProtectedRoute/>}>
            <Route path="/home" element={<Home/>}/>
            <Route path="/events" element={<EventsList/>}/>
            <Route path="/students" element={<Students/>}/>
            <Route path="/teachers" element={<TeachersList/>}/>
            <Route path="/groups" element={<GroupsList/>}/>
            <Route path="/classrooms" element={<ClassroomsList/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/admins" element={<Admins/>}/>
            <Route path="/lessons" element={<LessonsList/>}/>
            <Route path="/lesson-types" element={<LessonTypes/>}/>
            <Route path="/levels" element={<LevelsList/>}/>
            <Route path="/event-types" element={<EventTypesList/>}/>
            <Route path="/subscriptions" element={<SubscriptionsList/>}/>
            <Route path="/subscription-templates" element={<SubscriptionTemplatesList/>}/>
            <Route path="/payments" element={<PaymentsList/>}/>
            <Route path="/payment-types" element={<PaymentTypesList/>}/>
            <Route path="/slots" element={<SlotsList/>}/>
            <Route path="/dance-styles" element={<DanceStylesList/>}/>
          </Route>

          <Route path="/" element={<Navigate to='/login' replace/>}/>
        </Routes>
      </Router>
    </LocalizationProvider>
  )
}

export default App;
