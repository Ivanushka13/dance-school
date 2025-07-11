import './EventListItem.css'
import React from 'react';
import {format} from "date-fns";
import {ru} from "date-fns/locale"
import { MdAccessTime } from 'react-icons/md';

export const EventListItem = ({ event }) => {

    const formatDate = (date) => {
        return format(new Date(date), "d MMMM yyyy, HH:mm", {locale: ru});
    }

    return (
        <div className="event-card">
            <div className="image-section">
                <img
                    src={event.photo_url}
                    alt={event.name}
                />
            </div>
            <div className="event-container">
                <span className="event-type">{event.event_type.name}</span>
                <div className="main-info">
                    <h2>{event.name}</h2>
                    <p>{event.description}</p>
                </div>
                <div className="event-date">
                    <MdAccessTime />
                    <span>{formatDate(event.start_time)}</span>
                </div>
            </div>
        </div>
    )
}