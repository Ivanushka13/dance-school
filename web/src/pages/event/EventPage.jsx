import "./EventPage.css"
import NavBar from "../../components/navbar/NavBar";
import { useState } from "react";
import { MdSearch } from 'react-icons/md';
import { EventListItem } from "../../components/EventListItem/EventListItem";
import { EVENT_TYPE_TAGS } from "../../constants/tags";
import EventFilters from "../../components/EventFilters/EventFilters";
import { sortData } from "../../util";

const EventPage = () => {
    const [searchText, setSearchText] = useState("");
    const [searchTags, setSearchTags] = useState(EVENT_TYPE_TAGS);

    const events = [
        {
            id: "20d36c81-fe95-4f00-97f8-8a9c5c1a2f3f",
            name: "Открытый урок по хип-хопу",
            description: "Бесплатный мастер-класс по основам хип-хоп танца.",
            startTime: "2024-08-12T18:00:00Z",
            picture: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&auto=format&fit=crop&q=80",
            eventType: "Workshop"
        },
        {
            id: "44b91c21-d1c7-4a59-8519-9c5405aeb8fa",
            name: "Семинар по бальным танцам",
            description: "Углубленное изучение техник бальных танцев с приглашенным тренером.",
            startTime: "2024-09-05T14:00:00Z",
            picture: "https://images.unsplash.com/photo-1594206629987-1247b67c0d0e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            eventType: "Seminar"
        },
        {
            id: "59c21b7d-f406-4b65-af6b-66979c6bc4c5",
            name: "Конкурс по сальсе",
            description: "Ежегодный конкурс сальсы среди студентов школы.",
            startTime: "2024-10-22T16:00:00Z",
            picture: "https://images.unsplash.com/photo-1635164055348-dd37462528a5?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            eventType: "Competition"
        },
        {
            id: "f4f4a619-64f9-46a4-a359-0a6476587088",
            name: "Вечер латиноамериканских танцев",
            description: "Вечерние танцы в стиле бачата и сальса для всех желающих.",
            startTime: "2024-08-30T20:00:00Z",
            picture: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&auto=format&fit=crop&q=80",
            eventType: "Party"
        },
        {
            id: "61f9a540-3678-4029-b18b-e33922ef5bd8",
            name: "Интенсив по контемпорари",
            description: "Интенсивный курс по технике контемпорари для продвинутых танцоров.",
            startTime: "2024-11-10T10:00:00Z",
            picture: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80",
            eventType: "Workshop"
        }
    ];

    const filteredData = sortData(events, searchText, searchTags);

    const updateTagsState = (id, newValue) => {
        const updatedTags = searchTags.map(tag =>
            tag.id === id ? { ...tag, value: newValue } : tag
        );
        setSearchTags(updatedTags);
    };

    const clearFilters = () => {
        const clearedTags = searchTags.map(tag => ({ ...tag, value: false }));
        setSearchTags(clearedTags);
        setSearchText("");
    };

    return (
        <div className="event-page">
            <NavBar />
            <div className="body">
                <div className="search-bar">
                    <div className="search">
                        <MdSearch size={24} color="#666" />
                        <input
                            type="text"
                            placeholder="Поиск мероприятий..."
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                        />
                    </div>
                </div>
                
                <EventFilters 
                    filters={searchTags}
                    onChange={updateTagsState}
                    onClear={clearFilters}
                />

                <div className="events-section">
                    {filteredData.map((item) => (
                        <EventListItem key={item.id} event={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventPage;