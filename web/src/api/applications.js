import {apiRequest} from "../util/apiService";

export const getApplications = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/lessons/search/student',
    data: data
  });
}