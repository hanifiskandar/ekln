import axios from 'axios';

const createAxiosInstance = (baseURL) => {
  const axiosInstance = axios.create({
    baseURL, 
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = 'auth_token'; // Replace with actual logic to retrieve token
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      // Log the request details
      // console.log('Request Config:', {
      //   url: config.url,
      //   method: config.method,
      //   headers: config.headers,
      //   params: config.params,
      //   data: config.data,
      // });
      return config; 
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error); 
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response, 
    (error) => {
      if (error.response && error.response.status === 401) {
        window.location.href = '/login';
      }
      return Promise.reject(error); 
    }
  );

  return axiosInstance;
};

export const fetchData = async ({
  baseURL,
  method = 'GET',
  endpoint,
  body = null,
  headers = {},
  params = {},
}) => {
  const axiosInstance = createAxiosInstance(baseURL); 

  const combinedHeaders = { ...axiosInstance.defaults.headers, ...headers };

  const config = {
    method,
    url: endpoint, 
    headers: combinedHeaders,
    params: (method === 'GET' || method === 'DELETE') ? undefined : params,
    data: method !== 'GET' && method !== 'DELETE' ? body : undefined,
  };

  // console.log('Request Config (Final):', config);

  try {
    const response = await axiosInstance(config); 
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default fetchData;
