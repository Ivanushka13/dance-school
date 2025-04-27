import "./EventPage.css"
import NavBar from "../../components/navbar/NavBar";
import {useEffect, useState} from "react";
import {MdSearch} from 'react-icons/md';
import {EventListItem} from "../../components/EventListItem/EventListItem";
import EventFilters from "../../components/EventFilters/EventFilters";
import {sortData} from "../../util";
import {apiRequest} from "../../util/apiService";
import PageLoader from "../../components/PageLoader/PageLoader";

const EventPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTags, setSearchTags] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiRequest({
          method: 'POST',
          url: '/events/search/full-info',
          data: {terminated: false}
        });

        setEvents(response.events);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await apiRequest({
          method: 'POST',
          url: '/eventTypes/search',
          data: {terminated: false}
        });

        const updatedTags = response.event_types.map((tag) => ({
          ...tag,
          value: false,
          color: 'black'
        }));

        setSearchTags(updatedTags);
        setLoading(false);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchEventTypes();
  }, []);

  const filteredData = sortData(events, searchText, searchTags);

  const updateTagsState = (id, newValue) => {
    const updatedTags = searchTags.map(tag =>
      tag.id === id ? {...tag, value: newValue} : tag
    );
    setSearchTags(updatedTags);
  };

  const clearFilters = () => {
    const clearedTags = searchTags.map(tag => ({...tag, value: false}));
    setSearchTags(clearedTags);
    setSearchText("");
  };

  return (
    <div className="event-page">
      <NavBar/>
      <div className="body">
        <PageLoader loading={loading} text="Загрузка мероприятий...">
          <div className="search-bar">
            <div className="search">
              <MdSearch size={24} color="#666"/>
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
              <EventListItem key={item.id} event={item}/>
            ))}
          </div>
        </PageLoader>
      </div>
    </div>
  );
};

export default EventPage;