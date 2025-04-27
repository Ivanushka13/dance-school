import "./LessonListItem.css"
import {format, parseISO} from "date-fns";
import { ru } from "date-fns/locale";
import { MdAccessTime, MdLocationOn, MdPerson, MdGroup, MdOutlineBookmark, MdCalendarToday, MdOutlineClass } from 'react-icons/md';
import React from "react";

export const LessonListItem = ({lesson, onClick}) => {
    const formatDate = (date, formatString) => {
        return format(parseISO(date), formatString, {locale: ru});
    };

    const formatTimeRange = (start, finish) => {
        return `${format(parseISO(start), 'HH:mm')} - ${format(parseISO(finish), 'HH:mm')}`;
    };

    const isIndividual = lesson.lesson_type.is_group !== true;
    const lessonType = isIndividual ? "individual" : "group";
    
    return (
        <div className="lesson-list-item" onClick={() => onClick(lesson.id)}>
            <article className={`lesson-card ${lessonType}`}>
                <div className="lesson-card-top">
                    <h2 className="lesson-title">{lesson.name}</h2>
                    <div className="lesson-badges">
                        {!isIndividual && (
                            <div className="lesson-badge level">
                                <MdOutlineClass /> <span>{lesson.group.level.name}</span>
                            </div>
                        )}
                        <div className={`lesson-badge ${lessonType}`}>
                            {isIndividual ? 
                                <><MdPerson /> <span>Индивидуальное</span></> : 
                                <><MdGroup /> <span>Групповое</span></>
                            }
                        </div>
                    </div>
                </div>
                
                <div className="lesson-content">
                    {lesson.description && (
                        <p className="lesson-description">{lesson.description}</p>
                    )}
                    
                    <div className="lesson-info-container">

                        <div className="lesson-info-row">
                            <div className="info-item">
                                <div className="info-icon"><MdCalendarToday /></div>
                                <div className="info-text">{formatDate(lesson.start_time, 'dd MMMM yyyy')}</div>
                            </div>
                            
                            <div className="info-item">
                                <div className="info-icon"><MdAccessTime /></div>
                                <div className="info-text">{formatTimeRange(lesson.start_time, lesson.finish_time)}</div>
                            </div>
                        </div>
                        

                        <div className="lesson-info-row">
                            <div className="info-item">
                                <div className="info-icon"><MdOutlineBookmark /></div>
                                <div className="info-text">{lesson.lesson_type.dance_style.name || "Не указан"}</div>
                            </div>
                            
                            <div className="info-item">
                                <div className="info-icon"><MdLocationOn /></div>
                                <div className="info-text">{`${lesson?.classroom?.name || "Не указан"}`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};