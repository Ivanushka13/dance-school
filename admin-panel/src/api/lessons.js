import {apiRequest} from "../util/apiService";

export const getLessons = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/lessons/search/admin',
    data: data
  });
}

export const editLesson = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/lessons/${id}`,
    data: data
  });
}

export const addLesson = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/lessons',
    data: data
  });
}