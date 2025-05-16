import {apiRequest} from "../util/apiService";

export const getPaymentTypes = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/paymentTypes/search',
    data: data
  });
}

export const editPaymentType = async (
  id,
  data
) => {
  return await apiRequest({
    method: 'PATCH',
    url: `/paymentTypes/${id}`,
    data: data
  });
}

export const addPaymentType = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/paymentTypes',
    data: data
  });
}