import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import EventPage from "./pages/event/EventPage";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfile from "./pages/editProfile/EditProfile";
import SchedulePage from "./pages/schedule/SchedulePage";
import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/signup/SignUpPage";
import Subscriptions from "./pages/subscriptions/Subscriptions";
import Requests from "./pages/requests/Requests";
import ClassRegister from "./pages/class-register/ClassRegister";
import GroupLessons from "./pages/group-lessons/GroupLessons";
import SlotSelection from "./pages/slot-selection/SlotSelection";
import RequestDetails from "./pages/request-details/RequestDetails";
import {Lesson} from "./pages/lesson/Lesson";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {ru} from 'date-fns/locale';
import Register from './pages/register/Register';
import CreateSlot from './pages/createSlot/CreateSlot';
import Group from './pages/group/Group';
import Applications from './pages/applications/Applications';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import Slots from './pages/slots/Slots';
import ScrollToTop from "./util/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Router future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
        <ScrollToTop/>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>

          <Route element={<ProtectedRoute/>}>
            <Route path="/events" element={<EventPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/editProfile" element={<EditProfile/>}/>
            <Route path="/schedule" element={<SchedulePage/>}/>
            <Route path="/lesson/:lesson_id" element={<Lesson/>}/>
            <Route path="/group/:group_id" element={<Group/>}/>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']}/>}>
            <Route path="/subscriptions" element={<Subscriptions/>}/>
            <Route path="/class-register" element={<ClassRegister/>}/>
            <Route path="/slot-selection" element={<SlotSelection/>}/>
            <Route path="/applications" element={<Applications/>}/>
            <Route path="/group-lessons" element={<GroupLessons/>}/>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['teacher']}/>}>
            <Route path="/request-details/:request_id" element={<RequestDetails/>}/>
            <Route path="/slots" element={<Slots/>}/>
            <Route path="/requests" element={<Requests/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/createSlot" element={<CreateSlot/>}/>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace/>}/>
          <Route path="/not-fount" element={<NotFoundPage/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
