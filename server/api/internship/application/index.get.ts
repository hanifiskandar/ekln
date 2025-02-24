import { defineEventHandler, createError, getCookie, getQuery } from "h3";
import { $fetch } from "ofetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const system_identifier_hash = config.public.systemIdentifier;
  const internshipApiUrl = config.private.internshipApiUrl || "http://localhost:5000";
  const token = getCookie(event, "tokenCookie"); // Retrieve authentication token if needed
  const query = getQuery(event); // Get query parameters
  const EXTERNAL_API_URL = `${internshipApiUrl}/application`;

  // Check for required parameters (token and system_identifier_hash)
  // if (!token || !system_identifier_hash) {
  //   return createError({
  //     statusCode: 400,
  //     statusMessage: "Missing required parameters.",
  //   });
  // }

  try {
    const response = await $fetch(EXTERNAL_API_URL, {
      method: "GET",
      params: query, // Pass the query parameters dynamically
      // headers: {
      //   "Content-Type": "application/json",
      //   Authorization: `Bearer ${token}`,
      //   "x-system-identifier": system_identifier_hash,
      // },
    });

    const { status, data, meta } = response; // Destructure response for easier access

    if (status >= 200 && status < 300) {
      return {
        data,
        success: true,
        status,
        message: "Data fetched successfully.",
        meta,
        total_records: meta?.total_records,
      };
    }

    // Handle different response statuses
    const errorMessage = getErrorMessage(status, response);
    console.error(`Request failed with status ${status}: ${errorMessage}`);

    return {
      data: false,
      success: false,
      status,
      message: errorMessage,
    };
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error("Error calling external API:", errorMessage);

    return {
      success: false,
      status: 500,
      message: errorMessage,
    };
  }
});

// Helper function to determine error message based on status
function getErrorMessage(status: number, response: any): string {
  if (!response || !response.status) {
    return "Failed to receive a valid response.";
  }

  switch (status) {
    case 400:
      return "Bad request. Please check your input.";
    case 401:
      return "Unauthorized. Please check your credentials.";
    case 403:
      return "Forbidden. You do not have permission to access this resource.";
    case 404:
      return "Not found. The requested resource could not be found.";
    case 500:
      return "Internal server error. Please try again later.";
    default:
      return response?.statusText || "An unexpected error occurred.";
  }
}

// Helper function to handle errors consistently
function handleApiError(error: any): string {
  if (error?.response) {
    return (
      error.response?.statusText ||
      "An error occurred while processing the request."
    );
  }

  // Log the full error object for easier debugging
  console.error("Error object:", error);

  return error instanceof Error ? error.message : "Unknown error occurred.";
}
