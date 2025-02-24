import { defineEventHandler, readBody, createError } from 'h3';
import { $fetch } from 'ofetch'; 

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const system_identifier_hash = config.public.systemIdentifier;
  const user_auth_api_url = config.private.userAuthApiUrl;

  const token = getCookie(event, 'tokenCookie');
  const route = event.context.params?._;
  const body = await readBody(event);

  if (!route || !token || !system_identifier_hash) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters.',
    });
  }

  const EXTERNAL_API_URL = `http://${user_auth_api_url}/${route}`; 
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "x-system-identifier": system_identifier_hash,
  };

  // console.log('Header ',headers)
  try {
    let message = null;
    const response = await $fetch(EXTERNAL_API_URL, {
      method: 'DELETE',
      body: body,
      headers: headers,
    });

    let status = response.status;

    if (response.status >= 200 && response.status < 300) {
      return { 
          data: response.data, 
          success: true,
          status: response.status,
          message: 'OK!!!!'
      }; 
    } 

    if (!response || response.status === undefined) {
      console.error('Request failed with undefined status');
      status = 500;
      message = 'Failed to receive a valid response.';
    }

    if (response.status === 401) {
      console.error('Unauthorized access, Status Code: 401');
      status = 401;
      message = 'Unauthorized. Please check your credentials.';
    }

    console.error('Request failed, Status Code:', status);

    return { data: false, success: false, status: status, message: message }
    
  } catch (error) {
    let status = 500; 
    let message = 'An error occurred while processing the request.';

    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { response?: { status?: number; statusText?: string } }; 
      
      if (err.response) {
        status = err.response.status || status;
        message = err.response.statusText || message;
      }
    } else if (error instanceof Error) {
      message = error.message; 
    }

    console.error('Error calling external login API:', error);

    return {
      success: false,
      status,
      message,
    };
  }
});
