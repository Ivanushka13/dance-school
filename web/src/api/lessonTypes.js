import {apiRequest} from "../util/apiService";

export const getLessonTypes = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/lessonTypes/search/full-info',
    data: data
  });
}