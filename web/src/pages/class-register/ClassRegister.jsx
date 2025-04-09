import "./ClassRegister.css";
import NavBar from "../../components/navbar/NavBar";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ClassRegister = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    const danceClasses = [
        {
            id: 1,
            name: "Аргентинское танго",
            description: "Классический стиль аргентинского танго",
            image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Милонга",
            description: "Быстрый и ритмичный стиль танго",
            image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Вальс-танго",
            description: "Танго в ритме вальса",
            image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&auto=format&fit=crop"
        },
        {
            id: 4,
            name: "Танго нуэво",
            description: "Современная интерпретация танго",
            image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&auto=format&fit=crop"
        },
        {
            id: 5,
            name: "Электро-танго",
            description: "Танго под электронную музыку",
            image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&auto=format&fit=crop"
        },
        {
            id: 6,
            name: "Салонное танго",
            description: "Элегантный социальный стиль танго",
            image: "https://images.unsplash.com/photo-1583318432730-a19c89692612?w=800&auto=format&fit=crop"
        }
    ];

    const handleClassClick = (danceClass) => {
        setSelectedClass(danceClass);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedClass(null);
    };

    const handleRegistration = (type) => {
        if (type === 'групповое') {
            navigate('/groupLessons');
        } else if (type === 'индивидуальное') {
            navigate('/slotSelection');
        }
        handleDialogClose();
    };

    return (
        <div>
            <NavBar />
            <main className="class-register-content">
                <div className="class-register-header">
                    <h1>Запись на занятия</h1>
                    <p>Выберите интересующее вас направление танца</p>
                </div>
                
                <div className="dance-classes-grid">
                    {danceClasses.map((danceClass) => (
                        <div 
                            key={danceClass.id} 
                            className="dance-class-card"
                            onClick={() => handleClassClick(danceClass)}
                        >
                            <div className="dance-class-image" style={{ backgroundImage: `url(${danceClass.image})` }} />
                            <div className="dance-class-info">
                                <h2>{danceClass.name}</h2>
                                <p>{danceClass.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Dialog 
                    open={isDialogOpen} 
                    onClose={handleDialogClose}
                    className="registration-dialog"
                >
                    <DialogTitle>
                        Тип занятия: {selectedClass?.name}
                    </DialogTitle>
                    <DialogContent>
                        <p>Выберите предпочитаемый формат занятия:</p>
                    </DialogContent>
                    <DialogActions className="dialog-buttons">
                        <Button 
                            onClick={() => handleRegistration('индивидуальное')}
                            variant="contained"
                            className="individual-button"
                        >
                            Индивидуальное занятие
                        </Button>
                        <Button 
                            onClick={() => handleRegistration('групповое')}
                            variant="contained"
                            className="group-button"
                        >
                            Групповое занятие
                        </Button>
                    </DialogActions>
                </Dialog>
            </main>
        </div>
    );
};

export default ClassRegister; 