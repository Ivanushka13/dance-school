import React from 'react';
import './EventFilters.css';
import { MdFilterList, MdWorkspaces, MdSchool, MdEmojiEvents, MdCelebration } from 'react-icons/md';

const EVENT_ICONS = {
    workshop: MdWorkspaces,
    seminar: MdSchool,
    competition: MdEmojiEvents,
    party: MdCelebration
};

const EventFilters = ({ filters, onChange, onClear }) => {
    const getIcon = (key) => {
        const Icon = EVENT_ICONS[key];
        return Icon ? <Icon /> : null;
    };

    return (
        <div className="filters-container">
            <div className="filters-header">
                <div className="filters-title">
                    <MdFilterList />
                    <span>Фильтры</span>
                </div>
                <button className="clear-filters" onClick={onClear}>
                    Сбросить
                </button>
            </div>
            <div className="filters-grid">
                {filters.map((filter) => (
                    <label key={filter.id} className="filter-item">
                        <input
                            type="checkbox"
                            className="filter-checkbox"
                            checked={filter.value}
                            onChange={(e) => onChange(filter.id, e.target.checked)}
                        />
                        <span className="filter-label">
                            {getIcon(filter.key)}
                            {filter.title}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default EventFilters; 