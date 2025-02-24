import { defineEventHandler, createError } from 'h3';
import { $fetch } from 'ofetch';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const internshipApiUrl = config.private.internshipApiUrl || "http://localhost:5000";
  const EXTERNAL_API_URL = `${internshipApiUrl}/application`;

  try {
    const formData = await readFormData(event);

    const response = await $fetch(EXTERNAL_API_URL, {
      method: "POST",
      body: formData,
    });

    return response;
    
  } catch (error: any) {
    console.error("Error handling request:", error);

    return createError({
      statusCode: error.response?.status || 500,
      statusMessage:
        error.response?.statusText || "Failed to process the data.",
    });
  }
});
