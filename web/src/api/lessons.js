import {apiRequest} from "../util/apiService";

export const postLessonRequest = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: 'lessons/request',
    data: data
  });
}