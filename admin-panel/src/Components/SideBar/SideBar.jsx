import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./SideBar.css";


import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventIcon from '@mui/icons-material/Event';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PaymentIcon from '@mui/icons-material/Payment';

const SideBar = () => {
    const location = useLocation();

    const menuItems = [
        {
            title: "Пользователи",
            items: [
                {
                    name: "Администраторы",
                    icon: <AdminPanelSettingsRoundedIcon />,
                    path: "/admins"
                },
                {
                    name: "Преподаватели",
                    icon: <SchoolRoundedIcon />,
                    path: "/teachers"
                },
                {
                    name: "Ученики",
                    icon: <PersonRoundedIcon />,
                    path: "/students"
                }
            ]
        },
        {
            title: "Обучение",
            items: [
                {
                    name: "Группы",
                    icon: <GroupsRoundedIcon />,
                    path: "/groups"
                },
                {
                    name: "Группы преподавателей",
                    icon: <PeopleAltRoundedIcon />,
                    path: "/teacher-groups"
                },
                {
                    name: "Группы учеников",
                    icon: <PeopleAltRoundedIcon />,
                    path: "/student-groups"
                },
                {
                    name: "Занятия",
                    icon: <ClassRoundedIcon />,
                    path: "/lessons"
                },
                {
                    name: "Уровни продвинутости",
                    icon: <TrendingUpIcon />,
                    path: "/levels"
                },
                {
                    name: "Залы",
                    icon: <MeetingRoomIcon />,
                    path: "/classrooms"
                }
            ]
        },
        {
            title: "Мероприятия",
            items: [
                {
                    name: "Мероприятия",
                    icon: <EventIcon />,
                    path: "/events"
                },
                {
                    name: "Типы мероприятий",
                    icon: <CategoryRoundedIcon />,
                    path: "/event-types"
                }
            ]
        },
        {
            title: "Учет",
            items: [
                {
                    name: "Посещения занятий",
                    icon: <HowToRegIcon />,
                    path: "/attendances"
                },
                {
                    name: "Абонементы",
                    icon: <CardMembershipIcon />,
                    path: "/subscriptions"
                },
                {
                    name: "Типы абонементов",
                    icon: <CardMembershipIcon />,
                    path: "/subscription-types"
                },
                {
                    name: "Платежи",
                    icon: <PaymentIcon />,
                    path: "/payments"
                },
                {
                    name: "Типы платежей",
                    icon: <PaymentIcon />,
                    path: "/payment-types"
                }
            ]
        },
        {
            title: "Профиль",
            items: [
                {
                    name: "Настройки",
                    icon: <AccountCircleRoundedIcon />,
                    path: `/profile`
                },
                {
                    name: "Выход",
                    icon: <LogoutRoundedIcon />,
                    path: "/login",
                    onClick: () => {
                        localStorage.clear();
                    }
                }
            ]
        }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <Link to="/home" className="logo-container">
                    <span className="logo-text">Elcentro</span>
                </Link>
            </div>
            
            <div className="sidebar-content">
                {menuItems.map((section, index) => (
                    <div key={index} className="menu-section">
                        <h3 className="section-title">{section.title}</h3>
                        <nav className="menu-items">
                            {section.items.map((item, itemIndex) => (
                                <Link
                                    to={item.path}
                                    key={itemIndex}
                                    className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                                    onClick={item.onClick}
                                >
                                    <span className="icon-container">{item.icon}</span>
                                    <span className="item-name">{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideBar;