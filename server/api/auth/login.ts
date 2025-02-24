import { defineEventHandler, readBody, createError } from 'h3';
import { $fetch } from 'ofetch'; 

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const system_identifier_hash = config.public.systemIdentifier;
  const user_auth_api_url = config.private.userAuthApiUrl;

  const EXTERNAL_API_URL = `http://${user_auth_api_url}/login`; 

  const body = await readBody(event);

  const { username, password } = body;

  if (!username || !password || !system_identifier_hash) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: username, password, or system_identifier_hash.',
    });
  }

  const loginPayload = {
    username,
    password,
    system_identifier_hash,
  };

  const headers = {
    "Content-Type": "application/json",
    "x-system-identifier": system_identifier_hash,
  };

  try {
    const response = await $fetch(EXTERNAL_API_URL, {
      method: 'POST',
      body: loginPayload,
      headers: headers,
    });

    if (response && response.data) {
      return { success: true, data: response.data }; 
    } else {
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials or external API error.',
      });
    }
  } catch (error) {
    console.error('Error calling external login API:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Error connecting to the login service.',
    });
  }
});
