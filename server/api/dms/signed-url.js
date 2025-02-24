import * as Minio from 'minio'

// Initialize the MinIO client
const minioClient = new Minio.Client({
  endPoint: 'localhost', 
  port: 9000,  
  useSSL: false,  
  accessKeyId: 'DM9a9khH1pBgzUa7ShGg2',    
  secretAccessKey: 'XSBdBWwqEbjiZSM9sNimGPZXfiGAtpyf3yRMewp4', 
});

const generateSignedUrl = () => {
  return new Promise((resolve, reject) => {
    const expires = 60 * 60;  
    const bucketName = 'internship'
    const objectName = 'home-banner-5.jpg'
    minioClient.presignedUrl('GET', bucketName, objectName, expires, (err, url) => {
      if (err) {
        reject(err);
      }
      resolve(url);
    });
  });
};

export default defineEventHandler(async (event) => {

  try {
    const buckets = await minioClient.listBuckets()
    console.log('Success', buckets)
    const url = await generateSignedUrl();
    return { url };
  } catch (err) {
    return { error: err.message };
  }
});
