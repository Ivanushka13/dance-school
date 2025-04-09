import "./LessonRequestsDatatable.scss"
import {DataGrid} from '@mui/x-data-grid';
import React, {useEffect, useState} from "react";
import Axios from "axios";
import ConfirmModal from "../../Modal/ConfirmModal/ConfirmModal";
import {Link} from "react-router-dom";

const columns = [
    {field: 'id', headerName: 'Id', width: 100},
    {field: 'studentId', headerName: 'Student id', width: 250},
    {field: 'teacherId', headerName: 'Teacher id', width: 100},
    {field: 'description', headerName: 'Description', width: 200},
    {field: 'startTime', headerName: 'Start time', width: 150},
    {field: 'finishTime', headerName: 'Finish time', width: 200},
    {field: 'terminated', headerName: 'Terminated', width: 200},
];

export function LessonRequestsDatatable() {
    const [url, setUrl] = useState("");

    const [requests, setRequests] = useState([]);

    const [loaded, setLoaded] = useState(false);

    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        if (loaded)
            return;
        Axios.get("https://localhost:7153/Requests")
            .then(
                (res) => {
                    setRequests(res?.data);
                });
        setLoaded(true);
    })

    const actionColumn = [
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={"/requests/view/" + params.row.id} style={{textDecoration: "none"}}>
                            <div className="viewButton">View</div>
                        </Link>
                        <Link to={"/requests/edit/" + params.row.id} style={{textDecoration: "none"}}>
                            <div className="editButton">Edit</div>
                        </Link>
                        <div className="deleteButton" onClick={() => {
                            setShowModal(true);
                            setUrl("https://localhost:7153/Requests?id=" + params.row.id)
                        }}>Delete
                        </div>
                    </div>
                )
            }
        }
    ]
    return (
        <div className="data">
            <div className="datatable">
                <DataGrid
                    rows={requests}
                    columns={columns.concat(actionColumn)}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </div>
            <ConfirmModal
                open={showModal}
                onClose={() => setShowModal(false)}
                text="Are you sure to delete request?"
                url={url}
                loaded={() => setLoaded(false)}
            />
        </div>
    )
}