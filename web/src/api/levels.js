import {apiRequest} from "../util/apiService";

export const getLevels = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/levels/search',
    data: data,
    requiresAuth: false
  });
}