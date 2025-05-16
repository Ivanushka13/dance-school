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

export const getRequest = async (
  lesson_id
) => {
  return await apiRequest({
    method: 'GET',
    url: `/lessons/full-info/${lesson_id}`,
  });
}

export const getRequests = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/lessons/search/teacher',
    data: data
  });
}

export const editLessonRequest = async (
  request_id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/lessons/request/${request_id}`,
    data: data
  });
}

export const getLesson = async (
  lesson_id
) => {
  return await apiRequest({
    method: 'GET',
    url: `/lessons/full-info/${lesson_id}`
  });
}

export const getTeacherLessons = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: `/lessons/search/teacher`,
    data: data
  });
}

export const getStudentLessons = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: `/lessons/search/student`,
    data: data
  });
}

export const signUpForLesson = async (
  sub_id,
  lesson_id
) => {
  return await apiRequest({
    method: 'POST',
    url: `/subscriptions/lessons/${sub_id}/${lesson_id}`
  });
}

export const revokeLesson = async (
  sub_id,
  lesson_id
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/subscriptions/lessons/cancel/${sub_id}/${lesson_id}`
  });
}

export const getGroupLessons = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: 'lessons/search/group',
    data: data
  });
}

export const postLesson = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/lessons/individual',
    data: data
  });
}