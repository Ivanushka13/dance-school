import {apiRequest} from "../util/apiService";

export const fetchSlots = async (
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