import {apiRequest} from "../util/apiService";

export const getSubscriptions = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/subscriptions/search',
    data: data
  });
}

export const editSubscription = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/subscriptions/${id}`,
    data: data
  });
}

export const addSubscription = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/subscriptions',
    data: data
  });
}