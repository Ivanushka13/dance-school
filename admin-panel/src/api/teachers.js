import {apiRequest} from "../util/apiService";

export const getTeachers = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/teachers/search/full-info',
    data: data
  });
}

export const editTeacher = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/teachers/${id}`,
    data: data
  });
}

export const addTeacher = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/teachers',
    data: data
  });
}