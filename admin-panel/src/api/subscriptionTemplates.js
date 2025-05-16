import {apiRequest} from "../util/apiService";

export const getSubscriptionTemplates = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/subscriptionTemplates/search',
    data: data
  });
}

export const editSubscriptionTemplate = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/subscriptionTemplates/${id}`,
    data: data
  });
}

export const addSubscriptionTemplate = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/subscriptionTemplates',
    data: data
  });
}