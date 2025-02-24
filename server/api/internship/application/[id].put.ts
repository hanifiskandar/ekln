import { defineEventHandler, readFormData, createError, getCookie } from "h3";
import { $fetch } from "ofetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const internshipApiUrl = config.private.internshipApiUrl || "http://localhost:5000";
  const token = getCookie(event, "tokenCookie"); // Assuming authentication is needed
  const EXTERNAL_API_URL = `${internshipApiUrl}/application`;

  try {
    const formData = await readFormData(event);

    // Validate formData before sending request
    if (!formData || Object.keys(formData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid request: No data provided.",
      });
    }

    const response = await $fetch(EXTERNAL_API_URL, {
      method: "PUT",
      body: formData,
      // headers: {
      //   Authorization: token ? `Bearer ${token}` : "",
      // },
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
