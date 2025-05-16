import {apiRequest} from "../util/apiService";

export const getClassrooms = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/classrooms/search/available',
    data: data
  });
}