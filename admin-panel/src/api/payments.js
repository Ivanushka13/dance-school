import {apiRequest} from "../util/apiService";

export const getPayments = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/payments/search',
    data: data
  });
}

export const editPayment = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/payments/${id}`,
    data: data
  });
}

export const addPayment = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/payments',
    data: data
  });
}