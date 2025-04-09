import "./ClassroomsDatatable.scss"
import {DataGrid} from '@mui/x-data-grid';
import React, {useState, useEffect} from "react";
import Axios from "axios";
import ConfirmModal from "../../Modal/ConfirmModal/ConfirmModal";
import {Link} from "react-router-dom";
import { ruRU } from '@mui/x-data-grid/locales';

const columns = [
    {field: 'id', headerName: 'Id', width: 100},
    {field: 'name', headerName: 'Name', width: 200},
    {field: 'description', headerName: 'Description', width: 250},
    {field: 'terminated', headerName: 'Terminated', width: 200},
];

export function ClassroomsDatatable() {

    const [url, setUrl] = useState("");

    const [classrooms, setClassrooms] = useState([]);

    const [loaded, setLoaded] = useState(false);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (loaded)
            return;
        Axios.get("https://localhost:7153/Classrooms")
            .then(
                (res) => {
                    setClassrooms(res?.data);
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
                        <Link to={"/classrooms/edit/" + params.row.id} style={{textDecoration: "none"}}>
                            <div className="editButton">Edit</div>
                        </Link>
                        <div className="deleteButton" onClick={() => {
                            setShowModal(true);
                            setUrl("https://localhost:7153/Classrooms?id=" + params.row.id)
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
                    rows={classrooms}
                    columns={columns.concat(actionColumn)}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                />
            </div>
            <div className="window">
                <ConfirmModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    text="Are you sure to delete classroom?"
                    url={url}
                    loaded={() => setLoaded(false)}
                />
            </div>
        </div>
    )
}