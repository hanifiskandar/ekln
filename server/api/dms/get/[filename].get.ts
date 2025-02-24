import minioClient from '../../../utils/minio';
import { createError } from 'h3';
import { pipeline } from 'stream';
import { promisify } from 'util';
import mime from 'mime-types';

const pipe = promisify(pipeline);

interface EventParams {
  filename: string;
}

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  console.log('params',params)

  if (!params || typeof params.filename !== 'string') {
    return createError({
      statusCode: 400,
      statusMessage: 'Filename is required',
      message: 'No filename provided in the request.',
    });
  }

  const filename = params.filename;
  const bucketName = 'internship'; 

  try {

    const fileStream = await minioClient.getObject(bucketName, filename);

    const mimeType = mime.lookup(filename) || 'application/octet-stream';
    console.log('mimeType', mimeType)
    event.node.res.setHeader('Content-Type', mimeType);
    event.node.res.setHeader('Content-Disposition', `inline; filename="${filename}"`); // Ni kalau nak open
    // event.res.setHeader('Content-Disposition', `attachment; filename="${filename}"`); // Ni kalau nak download

    await pipe(fileStream, event.node.res);

    console.log('File stream successfully piped to response');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error fetching file from MinIO:', err.message);
      return createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch the file from MinIO',
        message: err.message, 
      });
    } else {
      console.error('Unexpected error:', err);
      return createError({
        statusCode: 500,
        statusMessage: 'Unexpected error',
        message: 'An unexpected error occurred.',
      });
    }
  }
});
