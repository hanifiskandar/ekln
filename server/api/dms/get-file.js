// server/api/dms/get-file.js
import minioClient from '../../utils/minio';

export default defineEventHandler(async (event) => {
  const { filename } = event.context.params;  // Extract filename from request params

  const bucketName = 'internship';  // Make sure this is correct

  console.log(`Fetching file: ${filename} from bucket: ${bucketName}`);

  try {
    // Fetch file from MinIO using the filename
    const data = await minioClient.getObject(bucketName, filename);

    // Set appropriate headers for download
    event.res.setHeader('Content-Type', 'application/octet-stream');  // Default binary type
    event.res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Write the file data to the response and end the stream
    event.res.write(data);
    event.res.end();

    console.log('File fetched successfully');
  } catch (err) {
    console.error('Error fetching file from MinIO:', err);
    return sendError(event, {
      statusCode: 500,
      message: 'Failed to retrieve the file from MinIO',
      error: err.message,
    });
  }
});
