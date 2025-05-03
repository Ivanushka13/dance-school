import {apiRequest} from "../util/apiService";

export const fetchPaymentTypes = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/paymentTypes/search',
    data: data
  });
}

export const postPayment = async (
  payment_type_id,
  details = ''
) => {
  return await apiRequest({
    method: 'POST',
    url: '/payments',
    data: {
      payment_type_id: payment_type_id,
      details: 'details'
    }
  });
}