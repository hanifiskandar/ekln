import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: 'localhost', 
  port: 9000,
  useSSL: false,
  accessKeyId: 'mBL2rPKnPUM5qlkkICav',    
  secretAccessKey: 'VsxCGRQU9vOjEGQEltbbLnubaIxNVWJpxAmmUL2f', 
//   accessKeyId: '7NnRDiBj1My4eoSwf33k',    
//   secretAccessKey: 'DwuzW3q3UYKtQYizcB4f0kRn4k3zBQdm97S7Rs6e', 
//   accessKeyId: '7ECnUv4wNhyEvca6Igjl',    
//   secretAccessKey: '5jcnkLTFCdvIaT7FxJOwEapMpWJD15kCIbjA8PR9', 
});

export default minioClient;
