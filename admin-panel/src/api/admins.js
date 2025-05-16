import {apiRequest} from "../util/apiService";

export const getAdmins = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/admins/search/full-info',
    data: data
  });
}

export const editAdmin = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/admins/${id}`,
    data: data
  });
}

export const addAdmin = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/admins',
    data: data
  });
}