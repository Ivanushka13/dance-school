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