import './TeacherListItem.css'
import React from 'react';

export const TeacherListItem = ({teacher}) => {

    return (
        <div className="teacher-card">
            <div className="data-teacher-section">
                <img
                    src={teacher.photo}
                    alt="teacher-photo"
                />
                <div className="teacher-container">
                    <div className="teacher-name">
                        <h2>{`${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`}</h2>
                    </div>
                    <div className="teacher-info">
                        <div className="subLine">
                            <span>{teacher.description}</span>
                        </div>
                    </div>
                    <button className="register-teacher-btn">Записаться</button>
                </div>
            </div>
        </div>
    )
}