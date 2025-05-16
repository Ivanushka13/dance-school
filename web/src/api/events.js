import {apiRequest} from "../util/apiService";

export const getEvents = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/events/search/full-info',
    data: data
  });
}