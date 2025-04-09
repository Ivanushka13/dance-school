import './StudentListItem.css'
import React from 'react';

export const StudentListItem = ({student}) => {

    return (
        <div className="student-card">
            <div className="data-section">
                <img
                    src={student.photo}
                    alt="student-photo"
                />
                <div className="student-container">
                    <div className="user-name">
                        <h2>{`${student.firstName} ${student.lastName} ${student.middleName}`}</h2>
                        <h3>{student.level}</h3>
                    </div>
                    <div className="sub-info">
                        <div className="subLine">
                            <i className="fa fa-envelope-o" aria-hidden="true"/>
                            <span>{student.email}</span>
                        </div>
                        <div className="subLine">
                            <i className="fa fa-phone" aria-hidden="true"/>
                            <span>{student.phoneNumber}</span>
                        </div>
                        <div className="subLine">
                            <i className="fa fa-book" aria-hidden="true"/>
                            <span>{student.description}</span>
                        </div>
                    </div>
                </div>
                <div className="submit-btns">
                    <button className="reject-btn">Отказаться</button>
                    <button className="accept-btn">Принять</button>
                </div>
            </div>
        </div>
    )
}