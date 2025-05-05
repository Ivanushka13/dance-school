import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './NavBar.css';


import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import {logout} from "../../util/apiService";
import {useDispatch, useSelector} from "react-redux";
import {clearSession} from "../../redux/sessionSlice";


const pages = [
  {name: 'Главная', path: '/home'},
  {name: 'Администраторы', path: '/admins'},
  {name: 'Преподаватели', path: '/teachers'},
  {name: 'Ученики', path: '/students'},
  {name: 'Группы', path: '/groups'},
  {name: 'Занятия', path: '/lessons'},
  {name: 'Уровни продвинутости', path: '/levels'},
  {name: 'Залы', path: '/classrooms'},
  {name: 'Стили танца', path: '/dance-styles'},
  {name: 'Слоты', path: '/slots'},
  {name: 'Мероприятия', path: '/events'},
  {name: 'Типы мероприятий', path: '/event-types'},
  {name: 'Абонементы', path: '/subscriptions'},
  {name: 'Типы абонементов', path: '/subscription-types'},
  {name: 'Платежи', path: '/payments'},
  {name: 'Типы платежей', path: '/payment-types'},
  {name: 'Профиль', path: '/profile'},
  {name: 'Типы занятий', path: '/lesson-types'}
];

const NavBar = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const userName = useSelector(
    state => `${state.session.user.last_name} ${state.session.user.first_name}`);

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(clearSession());
    logout().then(() => {
      navigate('/login');
    });
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
    if (!event.target.closest('.nav-search-container') && !event.target.closest('.nav-profile-container')) {
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
    <div className="nav-navbar">
      <div className="nav-search-container">
        <SearchRoundedIcon className="nav-search-icon"/>
        <input
          type="text"
          placeholder="Поиск страницы..."
          className="nav-search-input"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {showResults && searchResults.length > 0 && (
          <div className="nav-search-results">
            {searchResults.map((page) => (
              <div
                key={page.path}
                className="nav-search-result-item"
                onClick={() => handlePageSelect(page.path)}
              >
                {page.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="nav-profile-container">
        <button className="nav-profile-button" onClick={handleProfileClick}>
          <PersonIcon className="nav-profile-icon"/>
          <span className="nav-profile-name">{userName}</span>
          <KeyboardArrowDownRoundedIcon className={`nav-arrow-icon ${isProfileMenuOpen ? 'open' : ''}`}/>
        </button>

        {isProfileMenuOpen && (
          <div className="nav-profile-menu">
            <Link to="/profile" className="nav-profile-menu-item">
              Настройки профиля
            </Link>
            <div className="nav-profile-menu-item" onClick={() => handleLogout()}>
              Выйти
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;