import {apiRequest} from "../util/apiService";

export const fetchUserData = async () => {
  return await apiRequest({
    method: 'get',
    url: '/auth/me',
  });
}