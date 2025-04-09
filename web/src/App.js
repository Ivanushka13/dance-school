import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import EventPage from "./pages/event/EventPage";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfile from "./pages/editProfile/EditProfile";
import SchedulePage from "./pages/schedule/SchedulePage";
import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/signup/SignUpPage";
import Subscriptions from "./pages/subscriptions/Subscriptions";
import Requests from "./pages/requests/Requests";
import ClassRegister from "./pages/class-register/ClassRegister";
import {AuthProvider, useAuth} from "./context/AuthContext";
import GroupLessons from "./pages/group-lessons/GroupLessons";
import SlotSelection from "./pages/slot-selection/SlotSelection";
import RequestDetails from "./pages/request-details/RequestDetails";
import GroupLesson from "./pages/groupLesson/GroupLesson";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import Register from './pages/register/Register';
import CreateSlot from './pages/createSlot/CreateSlot';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};


const TeacherDashboard = () => <div>Панель преподавателя</div>;
const StudentDashboard = () => <div>Панель ученика</div>;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                    <Router>
                        <Routes>
                            <Route path="/events" element={<EventPage/>}/>
                            <Route path="/profile" element={<ProfilePage/>}/>
                            <Route path="/editProfile" element={<EditProfile/>}/>
                            <Route path="/schedule" element={<SchedulePage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/signup" element={<SignUpPage/>}/>
                            <Route path="/register/individual" element={<Register />} />
                            <Route path="/subscriptions" element={<Subscriptions/>}/>
                            <Route path="/requests" element={<Requests/>}/>
                            <Route path="/classRegister" element={<ClassRegister/>}/>
                            <Route path="/groupLessons" element={<GroupLessons/>}/>
                            <Route path="/group-lesson/:lessonId" element={<GroupLesson/>}/>
                            <Route path="/slotSelection" element={<SlotSelection/>}/>
                            <Route path="/requestDetails" element={<RequestDetails/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/createSlot" element={<CreateSlot/>}/>
                            <Route
                                path="/teacher"
                                element={
                                    <ProtectedRoute allowedRoles={['teacher']}>
                                        <TeacherDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student"
                                element={
                                    <ProtectedRoute allowedRoles={['student']}>
                                        <StudentDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/request-details/:id" element={<RequestDetails />} />
                        </Routes>
                    </Router>
                </LocalizationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
