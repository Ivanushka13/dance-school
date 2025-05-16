import {apiRequest} from "../util/apiService";

export const getEvents = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/events/search',
    data: data
  });
}

export const editEvent = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/events/${id}`,
    data: data
  });
}

export const addEvent = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/events',
    data: data
  });
}