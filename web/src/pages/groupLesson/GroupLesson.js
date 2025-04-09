import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import NavBar from "../../components/navbar/NavBar";
import './GroupLesson.css';

const GroupLesson = () => {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const dateStr = searchParams.get('date');
    const selectedDate = dateStr ? parseISO(dateStr) : new Date();

    const lessonsData = {
      1: {
        id: 1,
        title: "Хип-хоп для начинающих",
        type: "Групповое",
        level: "beginner",
        startTime: new Date(selectedDate).setHours(10, 0),
        endTime: new Date(selectedDate).setHours(11, 30),
        description: "Базовые движения и основы хип-хопа для новичков",
        instructor: "Анна Петрова",
        hall: "Зал №1",
        currentStudents: 6,
        maxStudents: 12,
        hasNeighbors: true,
        group: "Группа 1"
      },
      2: {
        id: 2,
        title: "Контемпорари",
        type: "Групповое",
        level: "intermediate",
        startTime: new Date(selectedDate).setHours(12, 0),
        endTime: new Date(selectedDate).setHours(13, 30),
        description: "Современная хореография для среднего уровня",
        instructor: "Михаил Иванов",
        hall: "Зал №2",
        currentStudents: 6,
        maxStudents: 15,
        hasNeighbors: false,
        group: "Группа 2"
      },
      3: {
        id: 3,
        title: "Продвинутый джаз",
        type: "Групповое",
        level: "advanced",
        startTime: new Date(selectedDate).setHours(15, 0),
        endTime: new Date(selectedDate).setHours(16, 30),
        description: "Сложные связки и импровизация",
        instructor: "Елена Сидорова",
        hall: "Зал №3",
        currentStudents: 6,
        maxStudents: 10,
        hasNeighbors: true,
        group: "Группа 3"
      }
    };

    setTimeout(() => {
      setLesson(lessonsData[lessonId]);
      setStudents([
        { 
          id: 1, 
          name: 'Иван Иванов', 
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
          level: 'Начинающий'
        },
        { 
          id: 2, 
          name: 'Мария Сидорова', 
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
          level: 'Средний'
        },
        { 
          id: 3, 
          name: 'Алексей Петров', 
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
          level: 'Начинающий'
        },
        { 
          id: 4, 
          name: 'Елена Козлова', 
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
          level: 'Средний'
        },
        { 
          id: 5, 
          name: 'Дмитрий Смирнов', 
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
          level: 'Начинающий'
        },
        { 
          id: 6, 
          name: 'Анна Морозова', 
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
          level: 'Средний'
        }
      ].slice(0, lessonsData[lessonId].currentStudents));
      setLoading(false);
    }, 1000);
  }, [lessonId, searchParams]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="group-lesson-content">
          <div className="group-lesson-container">
            <div className="group-lesson-loader">Загрузка...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="group-lesson-content">
        <div className="group-lesson-container">
          <div className="group-lesson-info-section">
            <h1>Информация о занятии</h1>
            
            <div className="group-lesson-info">
              <div className="group-lesson-info-row">
                <span className="group-lesson-info-label">Название:</span>
                <span className="group-lesson-info-value">{lesson.title}</span>
              </div>
              <div className="group-lesson-info-row">
                <span className="group-lesson-info-label">Дата:</span>
                <span className="group-lesson-info-value">
                  {format(lesson.startTime, 'd MMMM yyyy', { locale: ru })}
                </span>
              </div>
              <div className="group-lesson-info-row">
                <span className="group-lesson-info-label">Время:</span>
                <span className="group-lesson-info-value">
                  {format(lesson.startTime, 'HH:mm')} - {format(lesson.endTime, 'HH:mm')}
                </span>
              </div>
              <div className="group-lesson-info-row">
                <span className="group-lesson-info-label">Преподаватель:</span>
                <span className="group-lesson-info-value">{lesson.instructor}</span>
              </div>
              <div className="group-lesson-info-row">
                <span className="group-lesson-info-label">Зал:</span>
                <span className="group-lesson-info-value">{lesson.hall}</span>
              </div>
              <div className="group-lesson-info-row">
                <span className="group-lesson-info-label">Группа:</span>
                <span className="group-lesson-info-value">{lesson.group}</span>
              </div>
              <div className="group-lesson-info-row">
                <span className="group-lesson-info-label">Места:</span>
                <span className="group-lesson-info-value">
                  {lesson.currentStudents}/{lesson.maxStudents}
                </span>
              </div>
              <div className="group-lesson-info-row">
                <span className="group-lesson-info-label">Соседи в зале:</span>
                <span className="group-lesson-info-value">
                  {lesson.hasNeighbors ? 'Да' : 'Нет'}
                </span>
              </div>
            </div>

            <p className="group-lesson-description">
              {lesson.description}
            </p>
          </div>

          <div className="group-lesson-students-section">
            <div className="students-section-header">
              <h2>Участники</h2>
              <div className="students-count">
                <span>{lesson.currentStudents}</span>
                <span>/</span>
                <span>{lesson.maxStudents}</span>
              </div>
            </div>
            
            <div className="students-list">
              {students.map((student) => (
                <div key={student.id} className="student-item">
                  <img src={student.photo} alt={student.name} />
                  <div className="student-details">
                    <div className="student-name">{student.name}</div>
                    <div className="student-level">{student.level}</div>
                  </div>
                </div>
              ))}
              
              {lesson.currentStudents < lesson.maxStudents && (
                <div className="empty-slots">
                  <div className="empty-slots-count">
                    Свободных мест: {lesson.maxStudents - lesson.currentStudents}
                  </div>
                </div>
              )}
            </div>
          </div>

          {lesson.currentStudents < lesson.maxStudents && (
            <div className="group-lesson-action-buttons">
              <button 
                className="group-lesson-button"
                onClick={() => {}}
              >
                Записаться на занятие
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupLesson; 