import "./home.scss"
import SideBar from "../../Components/SideBar/SideBar";
import NavBar from "../../Components/NavBar/NavBar";
import Chart from "../../Components/chart/Chart";
import {EventsDatatable} from "../../Components/Datatables/EventsDatatable/EventsDatatable";

const Home = () => {
    return (
        <div className="home">
            <SideBar/>
            <div className="homeContainer">
                <NavBar/>
                <div className="charts">
                    <Chart aspect={2/1} title="Last 6 months (Revenue)"/>
                </div>
                <div className="listContainer">
                    <div className="listTitle">Latest orders</div>
                    <EventsDatatable/>
                </div>
            </div>
        </div>
    )
}

export default Home;