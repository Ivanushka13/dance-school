import React from 'react';
import './EventFilters.css';
import { MdFilterList} from 'react-icons/md';

const EventFilters = ({ filters, onChange, onClear }) => {
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
                            {filter.name}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default EventFilters; 