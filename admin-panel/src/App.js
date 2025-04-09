import {BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import LoginPage from "./Pages/Login/LoginPage";
import EventsList from "./Pages/Lists/EventsList/EventsList"
import StudentsList from "./Pages/Lists/StudentsList/StudentsList";
import GroupsList from "./Pages/Lists/GroupsList/GroupsList";
import React from "react";
import ClassroomsList from "./Pages/Lists/ClassroomsList/ClassroomsList";
import TeachersList from "./Pages/Lists/TeachersList/TeachersList";
import {LessonRequestsList} from "./Pages/Lists/LessonRequestsList/LessonRequestsList";
import Profile from "./Pages/Profile/Profile";
import AdminsList from "./Pages/Lists/AdminsList/AdminsList";
import TeacherGroupsList from "./Pages/Lists/TeacherGroupsList/TeacherGroupsList";
import StudentGroupsList from "./Pages/Lists/StudentGroupsList/StudentGroupsList";
import LessonsList from "./Pages/Lists/LessonsList/LessonsList";
import LevelsList from "./Pages/Lists/LevelsList/LevelsList";
import EventTypesList from "./Pages/Lists/EventTypesList/EventTypesList";
import AttendancesList from "./Pages/Lists/AttendancesList/AttendancesList";
import SubscriptionsList from "./Pages/Lists/SubscriptionsList/SubscriptionsList";
import SubscriptionTypesList from "./Pages/Lists/SubscriptionTypesList/SubscriptionTypesList";
import PaymentsList from "./Pages/Lists/PaymentsList/PaymentsList";
import PaymentTypesList from "./Pages/Lists/PaymentTypesList/PaymentTypesList";
import EditPage from './Pages/EditPage/EditPage';

function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/events" element={<EventsList/>}/>
                    <Route path="/students" element={<StudentsList/>}/>
                    <Route path="/teachers" element={<TeachersList/>}/>
                    <Route path="/groups" element={<GroupsList/>}/>
                    <Route path="/lessonRequests" element={<LessonRequestsList/>}/>
                    <Route path="/classrooms" element={<ClassroomsList/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/admins" element={<AdminsList/>}/>
                    <Route path="/teacher-groups" element={<TeacherGroupsList/>}/>
                    <Route path="/student-groups" element={<StudentGroupsList/>}/>
                    <Route path="/lessons" element={<LessonsList/>}/>
                    <Route path="/levels" element={<LevelsList/>}/>
                    <Route path="/event-types" element={<EventTypesList/>}/>
                    <Route path="/attendances" element={<AttendancesList/>}/>
                    <Route path="/subscriptions" element={<SubscriptionsList/>}/>
                    <Route path="/subscription-types" element={<SubscriptionTypesList/>}/>
                    <Route path="/payments" element={<PaymentsList/>}/>
                    <Route path="/payment-types" element={<PaymentTypesList/>}/>
                    <Route path="/edit" element={<EditPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
