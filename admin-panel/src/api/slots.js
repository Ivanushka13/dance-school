import {apiRequest} from "../util/apiService";

export const getSlots = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/slots/search',
    data: data
  });
}

export const editSlot = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/slots/${id}`,
    data: data
  });
}

export const addSlot = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/slots',
    data: data
  });
}