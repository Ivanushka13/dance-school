import {apiRequest} from "../util/apiService";

export const getClassrooms = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/classrooms/search',
    data: data
  });
}

export const editClassroom = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/classrooms/${id}`,
    data: data
  });
}

export const addClassroom = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/classrooms',
    data: data
  });
}