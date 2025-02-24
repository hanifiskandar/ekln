import { defineEventHandler, getQuery, createError, getCookie } from "h3";
import { $fetch } from "ofetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const internshipApiUrl = config.private.internshipApiUrl || "http://localhost:5000";
  const token = getCookie(event, "tokenCookie"); // Retrieve authentication token if needed
  const query = getQuery(event); // Get query parameters
  const EXTERNAL_API_URL = `${internshipApiUrl}/application/check-application`;

  try {
    const response = await $fetch(EXTERNAL_API_URL, {
      method: "GET",
      params: query, // Pass query parameters dynamically
      // headers: {
      //   ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add Authorization header if token exists
      // },
    });

    return response;
  } catch (error: any) {
    console.error("Error fetching data:", error?.response || error);

    return createError({
      statusCode: error.response?.status || 500,
      statusMessage:
        error.response?.statusText || "An error occurred while fetching data.",
    });
  }
});
