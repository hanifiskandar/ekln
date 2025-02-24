import axios from 'axios';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const ref_generic_api_url = config.private.refGenericApiUrl;

  const EXTERNAL_API_URL = `http://${ref_generic_api_url}/state`;

  try {
    const id = event.context.params?.id;
    
    if (!id) {
      return createError({ statusCode: 400, statusMessage: 'ID parameter is missing.' });
    }
    
    const body = await readBody(event);
    const response = await axios.put(`${EXTERNAL_API_URL}/${id}`, body, {
      headers: { 'Content-Type': 'application/json' },
    });
    return { success: true, data: response.data };
} catch (err) {
    console.error('Error fetching data:', err);

    const isAxiosError = (error: any): error is import("axios").AxiosError => {
      return error.isAxiosError;
    };

    if (isAxiosError(err) && err.response) {
      return createError({
        statusCode: err.response.status,
        statusMessage: err.message,
      });
    } else {
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      });
    }
  }
});
