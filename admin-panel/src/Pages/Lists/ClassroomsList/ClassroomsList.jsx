import React, { useState } from 'react';
import SideBar from "../../../Components/SideBar/SideBar";
import NavBar from "../../../Components/NavBar/NavBar";
import { DataGrid } from "@mui/x-data-grid";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
    { 
        id: 1,
        name: '101',
        capacity: 20,
        description: 'Основной учебный класс',
        deactivated: false
    },
    { 
        id: 2,
        name: '102',
        capacity: 15,
        description: 'Малый учебный класс',
        deactivated: true
    },
    { 
        id: 3,
        name: '103',
        capacity: 25,
        description: 'Лекционный зал',
        deactivated: false
    }
];

const ClassroomsList = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [classrooms, setClassrooms] = useState(initialRows);

    const columns = [
        {
            field: 'id',
            headerName: 'Идентификатор',
            width: 150,
            headerClassName: 'data-grid-header',
            type: 'number'
        },
        {
            field: 'name',
            headerName: 'Название',
            width: 200,
            headerClassName: 'data-grid-header',
            type: 'string'
        },
        {
            field: 'capacity',
            headerName: 'Вместимость',
            width: 150,
            headerClassName: 'data-grid-header',
            type: 'number'
        },
        {
            field: 'description',
            headerName: 'Описание',
            width: 300,
            headerClassName: 'data-grid-header',
            type: 'string'
        },
        {
            field: 'deactivated',
            headerName: 'Деактивирован',
            width: 150,
            headerClassName: 'data-grid-header',
            type: 'boolean',
            renderCell: (params) => (
                <div className={`status-cell ${params.value ? 'deactivated' : 'active'}`}>
                    {params.value ? (
                        <>
                            <CancelIcon className="status-icon" />
                            <span>Да</span>
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon className="status-icon" />
                            <span>Нет</span>
                        </>
                    )}
                </div>
            ),
        }
    ];

    const fields = [
        {
            name: 'id',
            label: 'Идентификатор',
            type: 'text',
            required: true
        },
        {
            name: 'name',
            label: 'Название',
            type: 'text',
            required: true
        },
        {
            name: 'capacity',
            label: 'Вместимость',
            type: 'text',
            required: true
        },
        {
            name: 'description',
            label: 'Описание',
            type: 'text',
            required: true
        },
        {
            name: 'deactivated',
            label: 'Деактивирован',
            type: 'switch',
            required: false
        }
    ];

    const handleAdd = (formData) => {
        const newClassroom = {
            id: parseInt(formData.id),
            name: formData.name,
            capacity: parseInt(formData.capacity),
            description: formData.description,
            deactivated: formData.deactivated || false
        };
        setClassrooms(prev => [...prev, newClassroom]);
        setShowAddForm(false);
    };

    const handleDelete = (classroom) => {
        setClassrooms(prev => prev.filter(c => c.id !== classroom.id));
    };

    const handleCancel = () => {
        setShowAddForm(false);
    };

    if (showAddForm) {
        return (
            <AddPage
                title="Добавить зал"
                Icon={MeetingRoomIcon}
                fields={fields}
                onSubmit={handleAdd}
                onCancel={handleCancel}
            />
        );
    }

    return (
        <ListPage
            title="Залы"
            Icon={MeetingRoomIcon}
            columns={columns}
            rows={classrooms}
            addButtonText="Добавить зал"
            onAddClick={() => setShowAddForm(true)}
            onDelete={handleDelete}
        />
    );
};

export default ClassroomsList;