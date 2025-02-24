import minioClient from '../../utils/minio';

export default defineEventHandler(async (event) => {
  const bucketName = 'internship';  // Replace with your MinIO bucket name

  try {
    // Use Promise with stream for listing objects
    const objectsList = await new Promise((resolve, reject) => {
      const objectsListTemp = [];
      
      // Start streaming the objects in the bucket
      const stream = minioClient.listObjectsV2(bucketName, '', true, '');

      // On receiving data (each file object), push the object name to the list
      stream.on('data', (obj) => {
        objectsListTemp.push(obj.name);
      });

      // On error, reject the promise
      stream.on('error', reject);

      // On stream end, resolve with the list of file names
      stream.on('end', () => {
        resolve(objectsListTemp);
      });
    });

    // If objectsList is empty, return a message indicating no files
    if (objectsList.length === 0) {
      return {
        statusCode: 404,
        message: 'No files found in the bucket',
      };
    }

    // Return the list of files found in the bucket
    return {
      files: objectsList,
    };
  } catch (err) {
    console.error('Error listing files:', err);
    return {
      statusCode: 500,
      message: 'Failed to retrieve file list from MinIO',
      error: err.message,
    };
  }
});
