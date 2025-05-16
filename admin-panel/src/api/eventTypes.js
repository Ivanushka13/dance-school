import {apiRequest} from "../util/apiService";

export const getEventTypes = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/eventTypes/search',
    data: data
  });
}

export const editEventType = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/eventTypes/${id}`,
    data: data
  });
}

export const addEventType = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/eventTypes',
    data: data
  });
}