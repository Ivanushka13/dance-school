import "./RequestDetails.css";
import NavBar from "../../components/navbar/NavBar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { MdAccessTime, MdPerson, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [request, setRequest] = useState(null);

    useEffect(() => {
        const loadRequestData = () => {
            const mockRequest = {
                student: {
                    id: id,
                    firstName: "Анна",
                    lastName: "Смирнова",
                    patronymic: "Ивановна",
                    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
                    level: "Начинающий",
                    phone: "+7 (999) 123-45-67",
                    email: "anna.smirnova@example.com"
                },
                lessonType: "Индивидуальное занятие",
                danceStyle: "Хип-хоп",
                date: "25 января 2024",
                startTime: "15:00",
                endTime: "16:30",
                teacher: "Михаил Иванов"
            };
            setRequest(mockRequest);
        };

        loadRequestData();
    }, [id]);

    const availableClassrooms = [
        {
            id: 1,
            name: "Большой зал",
            description: "Просторный зал с зеркалами и профессиональным звуковым оборудованием",
            capacity: 50
        },
        {
            id: 2,
            name: "Малый зал",
            description: "Уютное пространство для индивидуальных занятий",
            capacity: 15
        },
        {
            id: 3,
            name: "Зал для бальных танцев",
            description: "Зал с паркетным покрытием",
            capacity: 30
        }
    ];

    const handleClassroomSelect = (classroom) => {
        setSelectedClassroom(classroom.id === selectedClassroom?.id ? null : classroom);
    };

    const handleAccept = () => {
        if (selectedClassroom) {
            console.log("Заявка принята, выбран зал:", selectedClassroom);
            navigate('/requests');
        }
    };

    const handleReject = () => {
        console.log("Заявка отклонена");
        navigate('/requests');
    };

    if (!request) {
        return (
            <div>
                <NavBar />
                <main className="request-details-content">
                    <div className="request-details-container">
                        <div className="request-info-section">
                            <h1>Загрузка данных...</h1>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <main className="request-details-content">
                <div className="request-details-container">
                    <div className="request-info-section">
                        <h1>Информация о заявке</h1>
                        
                        <div className="student-info">
                            <img 
                                src={request.student.photo} 
                                alt={`${request.student.firstName} ${request.student.lastName}`}
                                className="student-photo"
                            />
                            <div className="student-details">
                                <h2>{request.student.lastName} {request.student.firstName} {request.student.patronymic}</h2>
                                <div className="level-badge">{request.student.level}</div>
                                <div className="contact-info">
                                    <div className="contact-item">
                                        <MdPhone className="contact-icon" />
                                        <span>{request.student.phone}</span>
                                    </div>
                                    <div className="contact-item">
                                        <MdEmail className="contact-icon" />
                                        <span>{request.student.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lesson-info">
                            <div className="info-row">
                                <span className="info-label">Тип занятия:</span>
                                <span className="info-value">{request.lessonType}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Направление:</span>
                                <span className="info-value">{request.danceStyle}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Преподаватель:</span>
                                <span className="info-value">{request.teacher}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Дата и время:</span>
                                <span className="info-value">
                                    {request.date}, {request.startTime} - {request.endTime}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="classrooms-section">
                        <h2>Доступные залы</h2>
                        <div className="classrooms-list">
                            {availableClassrooms.map((classroom) => (
                                <div 
                                    key={classroom.id}
                                    className={`classroom-card ${selectedClassroom?.id === classroom.id ? 'selected' : ''}`}
                                    onClick={() => handleClassroomSelect(classroom)}
                                >
                                    <div className="classroom-header">
                                        <h3>{classroom.name}</h3>
                                        <span className="capacity">
                                            <MdPerson />
                                            {classroom.capacity} чел.
                                        </span>
                                    </div>
                                    <p className="classroom-description">{classroom.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="action-buttons">
                        <Button 
                            variant="outlined" 
                            color="error"
                            className="reject-button"
                            onClick={handleReject}
                        >
                            Отклонить заявку
                        </Button>
                        <Button 
                            variant="contained"
                            className="accept-button"
                            disabled={!selectedClassroom}
                            onClick={handleAccept}
                        >
                            Принять заявку
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RequestDetails; 