import "./LessonListItem.css"
import {format, parseISO} from "date-fns";
import { MdAccessTime, MdLocationOn, MdPerson, MdGroup } from 'react-icons/md';
import React from "react";
import { BiTime, BiMap } from 'react-icons/bi';

export const LessonListItem = ({lesson}) => {
    return (
        <div className="lesson-card">
            <div className={`lesson-type-badge ${lesson.lessonType.toLowerCase()}`}>
                {lesson.lessonType === 'Individual' ? (
                    <>
                        <MdPerson className="badge-icon" />
                        <span>Индивидуальное</span>
                    </>
                ) : (
                    <>
                        <MdGroup className="badge-icon" />
                        <span>Групповое</span>
                    </>
                )}
            </div>

            <div className="lesson-content">
                <div className="lesson-main">
                    <h2 className="lesson-title">{lesson.name}</h2>
                    <p className="lesson-description">{lesson.description}</p>
                </div>

                <div className="lesson-details">
                    <div className="lesson-info-item">
                        <div className="lesson-info-icon">
                            <BiTime />
                        </div>
                        <div className="lesson-info-content">
                            <div className="lesson-info-label">Время</div>
                            <div className="lesson-info-value">
                                {format(parseISO(lesson.startTime), 'HH:mm')} - {format(parseISO(lesson.finishTime), 'HH:mm')}
                            </div>
                        </div>
                    </div>

                    <div className="lesson-info-item">
                        <div className="lesson-info-icon">
                            <BiMap />
                        </div>
                        <div className="lesson-info-content">
                            <div className="lesson-info-label">Место</div>
                            <div className="lesson-info-value">Зал {lesson.classroomId.slice(-4)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}