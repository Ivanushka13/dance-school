import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';


import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';


const pages = [
  { name: 'Дашборд', path: '/' },
  { name: 'Администраторы', path: '/admins' },
  { name: 'Преподаватели', path: '/teachers' },
  { name: 'Ученики', path: '/students' },
  { name: 'Группы', path: '/groups' },
  { name: 'Группы преподавателей', path: '/teacher-groups' },
  { name: 'Группы учеников', path: '/student-groups' },
  { name: 'Занятия', path: '/lessons' },
  { name: 'Уровни продвинутости', path: '/levels' },
  { name: 'Залы', path: '/classrooms' },
  { name: 'Мероприятия', path: '/events' },
  { name: 'Типы меероприятий', path: '/event-types' },
  { name: 'Посещения занятий', path: '/attendances' },
  { name: 'Абонементы', path: '/subscriptions' },
  { name: 'Типы абонементов', path: '/subscription-types' },
  { name: 'Платежи', path: '/payments' },
  { name: 'Типы платежей', path: '/payment-types' },
  { name: 'Профиль', path: '/profile' }
];

const NavBar = () => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const userName = localStorage.getItem('userName') || 'Администратор';

    const handleProfileClick = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            const results = pages.filter(page => 
                page.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handlePageSelect = (path) => {
        navigate(path);
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.search-container') && !event.target.closest('.profile-container')) {
            setShowResults(false);
            setIsProfileMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="navbar">
            <div className="search-container">
                <SearchRoundedIcon className="search-icon" />
                <input
                    type="text"
                    placeholder="Поиск страницы..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {showResults && searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map((page) => (
                            <div
                                key={page.path}
                                className="search-result-item"
                                onClick={() => handlePageSelect(page.path)}
                            >
                                {page.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="profile-container">
                <button className="profile-button" onClick={handleProfileClick}>
                    <AccountCircleRoundedIcon className="profile-icon" />
                    <span className="profile-name">{userName}</span>
                    <KeyboardArrowDownRoundedIcon className={`arrow-icon ${isProfileMenuOpen ? 'open' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                    <div className="profile-menu">
                        <Link to="/profile" className="profile-menu-item">
                            Настройки профиля
                        </Link>
                        <Link to="/login" className="profile-menu-item" onClick={() => localStorage.clear()}>
                            Выйти
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavBar;