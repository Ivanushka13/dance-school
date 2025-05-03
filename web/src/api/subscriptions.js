import {apiRequest} from "../util/apiService";

export const fetchSubscriptions = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/subscriptionTemplates/search/full-info',
    data: data,
  });
}

export const createSubscription = async (
  student_id,
  subscription_template_id,
  payment_id
) => {
  return await apiRequest({
    method: 'POST',
    url: '/subscriptions',
    data: {
      student_id: student_id,
      subscription_template_id: subscription_template_id,
      payment_id: payment_id
    }
  });
}