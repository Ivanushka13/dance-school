import "./LessonRequestsList.scss"
import SideBar from "../../../Components/SideBar/SideBar";
import NavBar from "../../../Components/NavBar/NavBar";
import {Link} from "react-router-dom";
import {LessonRequestsDatatable} from "../../../Components/Datatables/LessonRequestsDatatable/LessonRequestsDatatable";

export const LessonRequestsList = () => {
    return (
        <div className="list">
            <SideBar/>
            <div className="listContainer">
                <NavBar/>
                <div className="datatable">
                    <div className="listTitle">
                        <h1>Lesson Requests</h1>
                    </div>
                    <LessonRequestsDatatable/>
                    <Link to="/lessonRequests/new">
                        <button className="mainButton">Add new request</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}