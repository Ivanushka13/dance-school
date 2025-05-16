import {apiRequest} from "../util/apiService";

export const getLevels = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/levels/search',
    data: data
  });
}

export const editLevel = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/levels/${id}`,
    data: data
  });
}

export const addLevel = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/levels',
    data: data
  });
}