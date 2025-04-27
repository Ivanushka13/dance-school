import "./ClassRegister.css";
import NavBar from "../../components/navbar/NavBar";
import {useState, useEffect} from "react";
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import SearchBar from "../../components/searchBar/SearchBar";
import {apiRequest} from "../../util/apiService";
import PageLoader from "../../components/PageLoader/PageLoader";

const ClassRegister = () => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await apiRequest({
          method: 'POST',
          url: '/lessonTypes/search/full-info',
          data: {terminated: false}
        });

        setClasses(response.lesson_types);
        setLoading(false);

      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }

    fetchClasses();
  }, []);


  useEffect(() => {
    setFilteredClasses(
      classes.filter(item =>
        item.dance_style.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, classes]);

  const handleClassClick = (lesson) => {
    setSelectedClass(lesson);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedClass(null);
  };

  const handleRegistration = (type) => {
    if (type === 'group') {
      navigate('/group-lessons', {state: {selectedLessonType: selectedClass}});
    } else if (type === 'indiv') {
      navigate('/slot-selection', {state: {selectedLessonType: selectedClass}});
    }
    handleDialogClose();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div>
      <NavBar/>
      <main className="class-register-content">
        <PageLoader loading={loading} text="Загрузка занятий...">
          <div className="class-register-header">
            <h1>Запись на занятия</h1>
            <p>Выберите интересующее вас направление танца</p>
          </div>

          <SearchBar
            placeholder="Поиск стиля танца..."
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={clearSearch}
          />

          {filteredClasses.length === 0 ? (
            <div className="no-results">
              <p>Стили танца не найдены. Попробуйте изменить запрос.</p>
            </div>
          ) : (
            <div className="dance-classes-grid">
              {filteredClasses.map((danceClass) => (
                <div
                  key={danceClass.id}
                  className="dance-class-card"
                  onClick={() => handleClassClick(danceClass)}
                >
                  <div className="dance-class-image"
                       style={{backgroundImage: `url(${danceClass.dance_style.photo_url})`}}/>
                  <div className="dance-class-info">
                    <h2>{danceClass.dance_style.name}</h2>
                    <p>{danceClass.dance_style.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            className="registration-dialog"
          >
            <DialogTitle>
              Выбранное направление: {selectedClass?.dance_style.name}
            </DialogTitle>
            {selectedClass?.is_group ? (
              <DialogContent>
                <p>Тип занятия: <strong>Групповое</strong></p>
                <p>Групповые занятия проходят по расписанию в составе постоянной группы учеников с фиксированной
                  программой обучения.</p>
              </DialogContent>
            ) : (
              <DialogContent>
                <p>Тип занятия: <strong>Индивидуальное</strong></p>
                <p>Индивидуальные занятия проходят в формате "один на один" с преподавателем в удобное для вас
                  время.</p>
              </DialogContent>
            )}
            <DialogActions className="dialog-buttons">
              {selectedClass?.is_group ? (
                <Button
                  onClick={() => handleRegistration('group')}
                  variant="contained"
                  className="group-button"
                >
                  Перейти к выбору группы
                </Button>
              ) : (
                <Button
                  onClick={() => handleRegistration('indiv')}
                  variant="contained"
                  className="individual-button"
                >
                  Выбрать время занятия
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </PageLoader>
      </main>
    </div>
  );
};

export default ClassRegister; 