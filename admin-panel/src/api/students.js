import {apiRequest} from "../util/apiService";

export const getStudents = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/students/search/full-info',
    data: data
  });
}

export const editStudent = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/students/${id}`,
    data: data
  });
}

export const addStudent = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/auth/register',
    data: data
  });
}