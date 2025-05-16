import {apiRequest} from "../util/apiService";

export const getGroups = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/groups/search/',
    data: data
  });
}

export const editGroup = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/groups/${id}`,
    data: data
  });
}

export const addGroup = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/groups',
    data: data
  });
}