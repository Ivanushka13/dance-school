import {apiRequest} from "../util/apiService";

export const getLessonTypes = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/lessonTypes/search',
    data: data
  });
}

export const editLessonType = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/lessonTypes/${id}`,
    data: data
  });
}

export const addLessonType = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/lessonTypes',
    data: data
  });
}