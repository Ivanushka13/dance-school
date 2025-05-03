import "./ClassRegister.css";
import NavBar from "../../components/navbar/NavBar";
import React, {useState, useEffect} from "react";
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import SearchBar from "../../components/searchBar/SearchBar";
import {apiRequest} from "../../util/apiService";
import PageLoader from "../../components/PageLoader/PageLoader";
import InformationModal from "../../components/modal/info/InformationModal";
import {MdSearchOff} from "react-icons/md";

const ClassRegister = () => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [viewMode, setViewMode] = useState("group");

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
        setModalInfo({
          title: 'Ошибка при загрузке типов занятий',
          message: error.message || String(error),
        });
        setShowModal(true);
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);


  useEffect(() => {
    let filtered = classes.filter(item =>
      item.dance_style.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (viewMode === "group") {
      filtered = filtered.filter(item => item.is_group);
    } else if (viewMode === "individual") {
      filtered = filtered.filter(item => !item.is_group);
    }
    
    setFilteredClasses(filtered);
  }, [searchTerm, classes, viewMode]);

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
    <>
      <div>
        <NavBar/>
        <main className="class-register-content">
          <PageLoader loading={loading} text="Загрузка занятий...">
            <div className="class-register-header">
              <h1>Запись на занятия</h1>
              <p>Выберите интересующее вас направление танца</p>
            </div>

            <div className="class-register-controls">
              <SearchBar
                placeholder="Поиск стиля танца..."
                value={searchTerm}
                onChange={handleSearchChange}
                onClear={clearSearch}
              />
              
              <div className="view-mode-toggle">
                <button 
                  className={`view-mode-button ${viewMode === "group" ? "active" : ""}`}
                  onClick={() => setViewMode("group")}
                >
                  Групповые
                </button>
                <button 
                  className={`view-mode-button ${viewMode === "individual" ? "active" : ""}`}
                  onClick={() => setViewMode("individual")}
                >
                  Индивидуальные
                </button>
                <div className="view-mode-slider" style={{
                  left: viewMode === "group" ? "0%" : "50%"
                }}></div>
              </div>
            </div>

            {filteredClasses.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">
                  <MdSearchOff />
                </div>
                <h2 className="no-results-title">Стили танца не найдены</h2>
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
                      <div className="class-type-badge">
                        {danceClass.is_group ? "Групповое" : "Индивидуальное"}
                      </div>
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
                    onClick={async () => handleRegistration('group')}
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
      <InformationModal
        visible={showModal}
        onClose={async () => await setShowModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </>
  );
};

export default ClassRegister; 