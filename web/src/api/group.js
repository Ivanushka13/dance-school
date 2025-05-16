import {apiRequest} from "../util/apiService";

export const getGroups = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/groups/search',
    data: data
  });
};

export const fetchGroup = async (
  group_id
) => {
  return await apiRequest({
    method: 'GET',
    url: `/groups/full-info/${group_id}`
  });
};

export const groupJoin = async (
  user_id,
  group_id
) => {
  return await apiRequest({
    method: 'POST',
    url: `students/groups/${user_id}/${group_id}`
  });
}

export const deleteStudentFromGroup = async (
  student_id,
  group_id
) => {
  return await apiRequest({
    method: 'DELETE',
    url: `students/groups/${student_id}/${group_id}`
  });
}