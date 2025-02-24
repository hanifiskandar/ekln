import axios from "axios";
import { defineEventHandler, readBody, createError } from 'h3';
import { $fetch } from 'ofetch'; 

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const system_identifier_hash = config.public.systemIdentifier;
  const user_auth_api_url = config.private.userAuthApiUrl;

  const EXTERNAL_API_URL = `http://${user_auth_api_url}/refresh_token`; 

  const body = await readBody(event);

  const { refresh_token } = body;

  if (!refresh_token || !system_identifier_hash) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters.',
    });
  }
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${refresh_token}`,
    "x-system-identifier": system_identifier_hash,
  };
  
  const payload = {
    system_identifier_hash,
  };

  try {
    const response = await $fetch(EXTERNAL_API_URL, {
      method: 'POST',
      body: payload,
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
    console.error('Error calling external API:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Error connecting to the service.',
    });
  }
});

