import {apiRequest} from "../util/apiService";

export const fetchUserData = async () => {
  return await apiRequest({
    method: 'GET',
    url: '/auth/me',
  });
}

export const register = async (
  data
) => {
  return await apiRequest({
    method: 'POST',
    url: '/auth/register',
    data: data
  });
}