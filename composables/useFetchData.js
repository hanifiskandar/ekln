
export const useFetchData = () => {
  const fetchData = async ({
      token = null,
      API_URL,
      method = "GET",
      body = null,
      headers = {},
      params = {},
  }) => {
    const systemIdentifierHash = process.env.SYSTEM_IDENTIFIER; 

    if (!token) {
      throw new Error("Missing authentication token.");
    }

    const defaultHeaders = {
      "Content-Type": "application/json",
      "x-system-identifier": systemIdentifierHash,
    };

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const combinedHeaders = { ...defaultHeaders, ...headers };

    const requestOptions = {
      method,
      headers: combinedHeaders,
      body: null, 
      params, 
    };

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (body) {
        requestOptions.body = JSON.stringify(body);
      } else {
        throw new Error("Body required for POST, PUT, or PATCH requests");
      }
    }

    if (['GET', 'DELETE'].includes(method)) {
      requestOptions.body = undefined; 
    }

    const urlWithParams = params && Object.keys(params).length > 0
      ? `${API_URL}?${new URLSearchParams(params).toString()}`
      : API_URL;

    try {
      const response = await $fetch(urlWithParams, requestOptions);
      return response;
    } catch (error) {
      console.error("Error in API call:", error);
      throw new Error(error.message || "An error occurred while fetching data.");
    }
  };

  return {
    fetchData,
  };
};
