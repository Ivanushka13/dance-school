import {apiRequest} from "../util/apiService";

export const fetchTeachers = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/teachers/search/full-info',
    data: data
  });
}