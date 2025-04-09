import "./NavBar.css"
import {Link, useNavigate} from 'react-router-dom'
import { PiUserFill } from "react-icons/pi";
import { PiCalendarDotsBold } from "react-icons/pi";
import { PiStarFill } from "react-icons/pi";
import { PiSignInBold } from "react-icons/pi";
import { PiUserCheckFill } from "react-icons/pi";
import { PiCreditCardFill } from "react-icons/pi";
import { PiSignOutBold } from "react-icons/pi";
import {useAuth} from "../../context/AuthContext";

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const commonLinks = [
        {
            to: "/profile",
            icon: <PiUserFill />,
            title: "Профиль"
        }
    ];

    const teacherLinks = [
        {
            to: "/schedule",
            icon: <PiCalendarDotsBold />,
            title: "Расписание"
        },
        {
            to: "/events",
            icon: <PiStarFill />,
            title: "Мероприятия"
        },
        {
            to: "/requests",
            icon: <PiUserCheckFill />,
            title: "Заявки"
        }
    ];

    const studentLinks = [
        {
            to: "/subscriptions",
            icon: <PiCreditCardFill />,
            title: "Абонементы"
        },
        {
            to: "/events",
            icon: <PiStarFill />,
            title: "Мероприятия"
        },
        {
            to: "/schedule",
            icon: <PiCalendarDotsBold />,
            title: "Расписание"
        },
        {
            to: "/classRegister",
            icon: <PiSignInBold />,
            title: "Запись"
        }
    ];

    const links = user?.role === "teacher" ? teacherLinks : studentLinks;

    const renderNavItem = (link) => (
        <Link to={link.to} key={link.to} style={{textDecoration: "none"}}>
            <div className="item">
                <div className="icon">
                    {link.icon}
                </div>
                <div className="title">
                    {link.title}
                </div>
            </div>
        </Link>
    );

    return (
        <div className="navbar">
            <div className="main-title">
                <img
                    src="https://elcentro.ru/upload/media/content/logo.svg"
                    alt="test"
                    style={{width:'40%',height:'40%'}}
                />
            </div>
            <div className="items">
                {links.map(renderNavItem)}
                {commonLinks.map(renderNavItem)}
                <div className="item logout" onClick={handleLogout}>
                    <div className="icon">
                        <PiSignOutBold />
                    </div>
                    <div className="title">
                        Выйти
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar;