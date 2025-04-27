import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({
                       placeholder = "Поиск...",
                       value,
                       onChange,
                       onClear
                   }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`search-container ${isFocused ? 'focused' : ''}`}>
            <div className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="search-input"
            />
            {value && (
                <button className="clear-button" onClick={onClear}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6L18 18" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;