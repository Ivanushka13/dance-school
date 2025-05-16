import {apiRequest} from "../util/apiService";

export const getDanceStyles = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
      url: '/danceStyles/search',
    data: data
  });
}

export const editDanceStyle = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/danceStyles/${id}`,
    data: data
  });
}

export const addDanceStyle = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/danceStyles',
    data: data
  });
}