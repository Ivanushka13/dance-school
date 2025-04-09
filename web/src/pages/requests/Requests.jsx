import React, { useState } from 'react';
import NavBar from "../../components/navbar/NavBar";
import { MdEmail, MdPhone } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import "./Requests.css";

const StyledDialogTitle = styled(DialogTitle)({
    margin: 0,
    padding: '24px',
    backgroundColor: '#1a1a1a',
    color: '#fff !important',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '1.5',
    '& h2': {
        color: '#fff'
    }
});

const AnimatedButton = styled(Button)(({ theme, variant }) => ({
    height: '48px',
    borderRadius: '8px',
    textTransform: 'none',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    fontWeight: 400,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    backgroundColor: variant === 'contained' ? '#1a1a1a' : 'transparent',
    color: variant === 'contained' ? '#fff' : '#666',
    '&:hover': {
        transform: 'translateY(-4px)',
        backgroundColor: variant === 'contained' ? '#333' : 'rgba(0, 0, 0, 0.04)',
        color: variant === 'contained' ? '#fff' : '#333',
        boxShadow: variant === 'contained' ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none'
    },
    '&:active': {
        transform: 'translateY(-2px)',
        boxShadow: variant === 'contained' ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
    }
}));

const Requests = () => {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);

    const handleCreateIndividual = () => {
        setOpenDialog(false);
        navigate('/register');
    };

    const handleCreateSlot = () => {
        setOpenDialog(false);
        navigate('/createSlot');
    };

    const students = [
        {
            userId: "e1a5c879-9a1d-45c2-8f0d-d3442f2dcd1a",
            email: "ivanov.ivan@edu.hse.ru",
            firstName: "Иван",
            lastName: "Иванов",
            middleName: "Александрович",
            phoneNumber: "+79991234567",
            photo: "https://randomuser.me/api/portraits/men/1.jpg",
            role: "Student",
            description: "Увлекается современными танцами и хип-хопом.",
            level: "Intermediate"
        },
        {
            userId: "04f4b83e-7a10-4f30-a0f3-d8b53e1bdb62",
            email: "petrova.olga@edu.hse.ru",
            firstName: "Ольга",
            lastName: "Петрова",
            middleName: "Викторовна",
            phoneNumber: "+79992345678",
            photo: "https://randomuser.me/api/portraits/women/2.jpg",
            role: "Student",
            description: "Новичок в латиноамериканских танцах, активно учится.",
            level: "Beginner"
        },
        {
            userId: "84f5f86d-6e79-44d9-8a8f-3d2c92c5d012",
            email: "sidorov.alexey@edu.hse.ru",
            firstName: "Алексей",
            lastName: "Сидоров",
            middleName: "Иванович",
            phoneNumber: "+79993456789",
            photo: "https://randomuser.me/api/portraits/men/34.jpg",
            role: "Student",
            description: "Занимается бальными танцами уже несколько лет.",
            level: "Advanced"
        },
        {
            userId: "7d8f9a2b-3c4e-5f6g-7h8i-9j0k1l2m3n4o",
            email: "smirnova.anna@edu.hse.ru",
            firstName: "Анна",
            lastName: "Смирнова",
            middleName: "Дмитриевна",
            phoneNumber: "+79994567890",
            photo: "https://randomuser.me/api/portraits/women/4.jpg",
            role: "Student",
            description: "Профессионально занималась балетом.",
            level: "Advanced"
        },
        {
            userId: "5p6q7r8s-9t0u-1v2w-3x4y-5z6a7b8c9d0e",
            email: "kozlov.dmitry@edu.hse.ru",
            firstName: "Дмитрий",
            lastName: "Козлов",
            middleName: "Петрович",
            phoneNumber: "+79995678901",
            photo: "https://randomuser.me/api/portraits/men/36.jpg",
            role: "Student",
            description: "Начинающий танцор, интересуется джазом.",
            level: "Beginner"
        },
        {
            userId: "1f2g3h4i-5j6k-7l8m-9n0o-1p2q3r4s5t6u",
            email: "volkova.maria@edu.hse.ru",
            firstName: "Мария",
            lastName: "Волкова",
            middleName: "Андреевна",
            phoneNumber: "+79996789012",
            photo: "https://randomuser.me/api/portraits/women/32.jpg",
            role: "Student",
            description: "Занимается современными танцами.",
            level: "Intermediate"
        },
        {
            userId: "7v8w9x0y-1z2a-3b4c-5d6e-7f8g9h0i1j2k",
            email: "morozov.pavel@edu.hse.ru",
            firstName: "Павел",
            lastName: "Морозов",
            middleName: "Сергеевич",
            phoneNumber: "+79997890123",
            photo: "https://randomuser.me/api/portraits/men/88.jpg",
            role: "Student",
            description: "Увлекается брейк-дансом.",
            level: "Advanced"
        },
        {
            userId: "3l4m5n6o-7p8q-9r0s-1t2u-3v4w5x6y7z8a",
            email: "anna.smirnova@example.com",
            firstName: "Анна",
            lastName: "Смирнова",
            middleName: "Ивановна",
            phoneNumber: "+79998901234",
            photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
            role: "Student",
            description: "Начинающая танцовщица, изучает основы хореографии.",
            level: "Beginner"
        },
        {
            userId: "9b0c1d2e-3f4g-5h6i-7j8k-9l0m1n2o3p4q",
            email: "sokolov.andrey@edu.hse.ru",
            firstName: "Андрей",
            lastName: "Соколов",
            middleName: "Владимирович",
            phoneNumber: "+79999012345",
            photo: "https://randomuser.me/api/portraits/men/9.jpg",
            role: "Student",
            description: "Опытный танцор бальных танцев.",
            level: "Intermediate"
        }
    ];

    const handleRequestClick = (studentId) => {
        navigate(`/request-details/${studentId}`);
    };

    return (
        <div className="page-wrapper">
            <NavBar />
            <div className="requests-page">
                <div className="content">
                    <h1>Заявки на преподавание</h1>
                    <div className="cards">
                        {students.map(student => (
                            <div 
                                key={student.userId} 
                                className="card"
                                onClick={() => handleRequestClick(student.userId)}
                            >
                                <img 
                                    src={student.photo} 
                                    alt={student.firstName} 
                                    className="photo"
                                />
                                <div className="name">
                                    {student.lastName} {student.firstName}
                                    <div className="middleName">{student.middleName}</div>
                                </div>
                                <div className={`level ${student.level}`}>{student.level}</div>
                                <div className="contact">
                                    <MdEmail />
                                    {student.email}
                                </div>
                                <div className="contact">
                                    <MdPhone />
                                    {student.phoneNumber}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="add" onClick={() => setOpenDialog(true)}>+</button>
                </div>
            </div>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    style: {
                        borderRadius: '12px',
                        overflow: 'hidden',
                        minWidth: '400px',
                        margin: '16px'
                    }
                }}
            >
                <StyledDialogTitle>
                    Создание занятия
                </StyledDialogTitle>
                <DialogContent style={{ 
                    padding: '24px',
                    textAlign: 'center'
                }}>
                    <div style={{ 
                        color: '#666',
                        fontSize: '16px',
                        lineHeight: '1.5'
                    }}>
                        Выберите тип занятия, которое хотите создать
                    </div>
                </DialogContent>
                <DialogActions 
                    style={{ 
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        backgroundColor: '#f5f5f5'
                    }}
                >
                    <AnimatedButton 
                        onClick={handleCreateIndividual}
                        variant="contained"
                        fullWidth
                    >
                        Индивидуальное занятие
                    </AnimatedButton>
                    <AnimatedButton 
                        onClick={handleCreateSlot}
                        variant="contained"
                        fullWidth
                    >
                        Слот
                    </AnimatedButton>
                    <AnimatedButton 
                        onClick={() => setOpenDialog(false)}
                        variant="text"
                        fullWidth
                    >
                        Отмена
                    </AnimatedButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Requests;