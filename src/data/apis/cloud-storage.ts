import { ApiEntry } from '../../types/api';

export const cloudStorageApis: ApiEntry[] = [
  {
    id: 'aws-s3',
    name: 'AWS S3 REST API',
    description: 'Industry benchmark object storage with 99.999999999% (11 9s) durability, fine-grained IAM policies, lifecycle management, S3 Glacier archival, and pre-signed URLs.',
    shortDescription: 'Scalable object storage with high durability and pre-signed upload URLs.',
    category: 'cloud-storage',
    tags: ['cloud-storage', 's3', 'aws', 'object-storage', 'presigned-urls', 'backup', 'cdn'],
    website: 'https://aws.amazon.com/s3/',
    docsUrl: 'https://docs.aws.amazon.com/s3/',
    apiReferenceUrl: 'https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html',
    baseUrl: 'https://s3.<region>.amazonaws.com',
    authMethod: 'api-key',
    authSetupGuide: 'Sign requests using AWS Signature Version 4 with AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.',
    pricing: 'pay-as-you-go',
    pricingDetails: '$0.023 per GB/month for standard tier. Free tier gives 5GB for first 12 months.',
    sdks: [
      { language: 'Node/TypeScript', package: '@aws-sdk/client-s3', installCommand: 'npm install @aws-sdk/client-s3' },
      { language: 'Python', package: 'boto3', installCommand: 'pip install boto3' }
    ],
    quickstart: `import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const client = new S3Client({ region: 'us-east-1' });

await client.send(new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'avatar.png',
  Body: fileBuffer,
  ContentType: 'image/png',
}));`,
    endpoints: [
      {
        method: 'PUT',
        path: '/{bucket}/{key}',
        summary: 'Put Object',
        description: 'Upload an object to specified bucket and key.'
      },
      {
        method: 'GET',
        path: '/{bucket}/{key}',
        summary: 'Get Object',
        description: 'Download binary data and metadata for an object.'
      },
      {
        method: 'DELETE',
        path: '/{bucket}/{key}',
        summary: 'Delete Object',
        description: 'Remove object from bucket.'
      }
    ],
    useCases: ['User file uploads with pre-signed URLs', 'Data lakes and big data pipelines', 'Static website hosting and assets'],
    alternatives: ['cloudflare-r2', 'google-cloud-storage', 'backblaze-b2'],
    lastUpdated: '2026-02-10'
  },
  {
    id: 'cloudflare-r2',
    name: 'Cloudflare R2 Object Storage',
    description: 'S3-compatible object storage with ZERO egress fees, edge caching integration, and seamless worker integration across Cloudflare global edge network.',
    shortDescription: 'Zero egress fee, S3-compatible global object storage.',
    category: 'cloud-storage',
    tags: ['cloud-storage', 'cloudflare', 'r2', 'zero-egress', 's3-compatible', 'edge'],
    website: 'https://www.cloudflare.com/developer-platform/r2/',
    docsUrl: 'https://developers.cloudflare.com/r2/',
    apiReferenceUrl: 'https://developers.cloudflare.com/r2/api/s3/api/',
    baseUrl: 'https://<accountid>.r2.cloudflarestorage.com',
    authMethod: 'api-key',
    authSetupGuide: 'Generate R2 Access Token (Access Key ID and Secret Access Key) from Cloudflare Dashboard and configure S3 SDK endpoint.',
    pricing: 'pay-as-you-go',
    pricingDetails: '$0.015 / GB-month storage. 100% free egress bandwidth. Free tier: 10 GB/month.',
    sdks: [
      { language: 'Node.js (S3 Client)', package: '@aws-sdk/client-s3', installCommand: 'npm install @aws-sdk/client-s3' },
      { language: 'Cloudflare Workers', package: '@cloudflare/workers-types', installCommand: 'npm install -D @cloudflare/workers-types' }
    ],
    quickstart: `import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const S3 = new S3Client({
  region: 'auto',
  endpoint: \`https://\${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com\`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});`,
    endpoints: [
      {
        method: 'PUT',
        path: '/{bucket}/{key}',
        summary: 'Put Object',
        description: 'Upload object via S3 protocol.'
      }
    ],
    useCases: ['High-bandwidth downloads without egress charges (video/game assets)', 'Edge worker caching and file serving'],
    alternatives: ['aws-s3', 'backblaze-b2'],
    lastUpdated: '2026-03-01'
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary Media API',
    description: 'End-to-end image and video transformation, optimization, and digital asset management (DAM). Real-time resizing, background removal, AI tagging, and adaptive streaming.',
    shortDescription: 'AI image/video transformation, responsive sizing, and media delivery CDN.',
    category: 'cloud-storage',
    tags: ['cloud-storage', 'media', 'images', 'video', 'transformation', 'cdn', 'ai'],
    website: 'https://cloudinary.com',
    docsUrl: 'https://cloudinary.com/documentation',
    apiReferenceUrl: 'https://cloudinary.com/documentation/image_upload_api_reference',
    baseUrl: 'https://api.cloudinary.com/v1_1/{cloud_name}',
    authMethod: 'api-key',
    authSetupGuide: 'Configure cloud_name, api_key, and api_secret in SDK or sign uploads using SHA-1/SHA-256 signature.',
    pricing: 'freemium',
    pricingDetails: 'Free plan includes 25 monthly credits (~25GB storage or 25,000 transformations).',
    sdks: [
      { language: 'Node.js', package: 'cloudinary', installCommand: 'npm install cloudinary' },
      { language: 'Python', package: 'cloudinary', installCommand: 'pip install cloudinary' }
    ],
    quickstart: `import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const result = await cloudinary.uploader.upload('path/to/image.jpg', {
  transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }],
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/image/upload',
        summary: 'Upload Image',
        description: 'Upload and immediately apply transformations and AI enhancements.'
      }
    ],
    useCases: ['Automated thumbnail generation with face detection', 'Video format transcoding for mobile', 'Responsive modern image formats (AVIF/WebP)'],
    alternatives: ['uploadcare', 'aws-s3', 'imgix'],
    lastUpdated: '2026-01-25'
  }
];
