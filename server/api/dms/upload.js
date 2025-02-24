import minioClient from '../../utils/minio';

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event);
  
    // console.log('Received formData:', formData);
  
    const file = formData[0];
    
    if (!file) {
        return createError({
            statusCode: 400,
            statusMessage: 'No file provided',
        });
    }

    const bucketName = 'internship';
    const folderPath = 'applications/';
    // const fileName = folderPath + file.filename;
    const fileName = file.filename;

    console.log('Received file:', file);
  
    try {
        if (!Buffer.isBuffer(file.data)) {
            return createError({
                statusCode: 500,
                statusMessage: 'Expected file data to be in buffer format',
            });
        }

        await minioClient.putObject(bucketName, fileName, file.data);
        return { message: 'File uploaded successfully!' };
    } catch (error) {
        console.error('Error uploading to MinIO:', error);
        return createError({
            statusCode: 500,
            statusMessage: 'Failed to upload file to MinIO',
        });
    }
  });