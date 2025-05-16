import {apiRequest} from "../util/apiService";

export const getSlots = async (
  date_from,
  date_to,
  lesson_type_ids
) => {
  return await apiRequest({
    method: 'POST',
    url: `/slots/search/available`,
    data: {
      date_from: date_from,
      date_to: date_to,
      lesson_type_ids: lesson_type_ids
    }
  });
}

export const getAllSlots = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/slots/search',
    data: data
  });
}

export const createSlot = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/slots',
    data: data
  });
}

export const deleteTeacherSlot = async (
  slot_id
) => {
  return await apiRequest({
    method: 'DELETE',
    url: `/slots/${slot_id}`,
  });
}