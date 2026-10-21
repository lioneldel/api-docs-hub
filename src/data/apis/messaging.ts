import { ApiEntry } from '../../types/api';

export const messagingApis: ApiEntry[] = [
  {
    id: 'resend',
    name: 'Resend Email API',
    description: 'Modern email delivery API designed for developers and React developers. Build emails using React Email components, with first-class DKIM/SPF domain verification, webhooks, and analytics.',
    shortDescription: 'Developer-first transactional email with native React Email component support.',
    category: 'messaging',
    tags: ['messaging', 'email', 'transactional', 'react-email', 'developer-first', 'webhooks'],
    website: 'https://resend.com',
    docsUrl: 'https://resend.com/docs',
    apiReferenceUrl: 'https://resend.com/docs/api-reference/introduction',
    baseUrl: 'https://api.resend.com',
    authMethod: 'bearer-token',
    authSetupGuide: 'Generate API key in Resend dashboard and pass in header Authorization: Bearer re_123456789.',
    pricing: 'freemium',
    pricingDetails: 'Free tier includes 3,000 emails/month (100/day). Pro starts at $20/month for 50,000 emails.',
    sdks: [
      { language: 'Node/TypeScript', package: 'resend', installCommand: 'npm install resend' },
      { language: 'Python', package: 'resend', installCommand: 'pip install resend' }
    ],
    quickstart: `import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['delivered@resend.dev'],
  subject: 'Welcome to our platform!',
  html: '<strong>We are thrilled to have you on board!</strong>',
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/emails',
        summary: 'Send Email',
        description: 'Sends a transactional or marketing email with HTML/React components and attachments.'
      },
      {
        method: 'GET',
        path: '/emails/{id}',
        summary: 'Retrieve Email',
        description: 'Fetch delivery status, opens, and click tracking metrics.'
      }
    ],
    useCases: ['Password reset and welcome onboarding emails', 'React Email template rendering', 'Receipts and notifications'],
    alternatives: ['sendgrid', 'postmark', 'mailgun'],
    lastUpdated: '2026-03-01'
  },
  {
    id: 'twilio',
    name: 'Twilio Programmable Messaging API',
    description: 'Global communications platform for SMS, MMS, WhatsApp, Voice calling, and two-factor authentication (Verify API) across 180+ countries.',
    shortDescription: 'Global SMS, MMS, WhatsApp messaging, and phone number provisioning.',
    category: 'messaging',
    tags: ['messaging', 'sms', 'mms', 'whatsapp', '2fa', 'telecom', 'otp'],
    website: 'https://twilio.com',
    docsUrl: 'https://www.twilio.com/docs',
    apiReferenceUrl: 'https://www.twilio.com/docs/messaging/api',
    baseUrl: 'https://api.twilio.com/2010-04-01',
    authMethod: 'basic-auth',
    authSetupGuide: 'HTTP Basic Auth using Twilio Account SID as username and Auth Token as password.',
    pricing: 'pay-as-you-go',
    pricingDetails: 'US SMS starts around $0.0079 to send/receive. Dedicated phone numbers from $1.15/month.',
    sdks: [
      { language: 'Node.js', package: 'twilio', installCommand: 'npm install twilio' },
      { language: 'Python', package: 'twilio', installCommand: 'pip install twilio' }
    ],
    quickstart: `import twilio from 'twilio';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const message = await client.messages.create({
  body: 'Your verification code is 492019',
  from: '+1234567890',
  to: '+1987654321',
});
console.log(message.sid);`,
    endpoints: [
      {
        method: 'POST',
        path: '/Accounts/{AccountSid}/Messages.json',
        summary: 'Send SMS / WhatsApp',
        description: 'Dispatches text or media message to mobile phone number.'
      }
    ],
    useCases: ['SMS OTP verification codes', 'Automated delivery notifications', 'Two-way customer support chat over WhatsApp'],
    alternatives: ['plivo', 'sinch', 'vonage'],
    lastUpdated: '2026-02-14'
  },
  {
    id: 'onesignal',
    name: 'OneSignal Push Notification API',
    description: 'Cross-platform push notification engine for Web, iOS (APNs), Android (FCM), and in-app messaging with audience segmentation and A/B testing.',
    shortDescription: 'Omnichannel push notifications, web push, and in-app modals.',
    category: 'messaging',
    tags: ['messaging', 'push-notifications', 'mobile', 'web-push', 'in-app-messaging'],
    website: 'https://onesignal.com',
    docsUrl: 'https://documentation.onesignal.com',
    apiReferenceUrl: 'https://documentation.onesignal.com/reference/create-notification',
    baseUrl: 'https://onesignal.com/api/v1',
    authMethod: 'bearer-token',
    authSetupGuide: 'Supply REST API Key in Authorization header: "Basic <REST_API_KEY>" and include app_id in body.',
    pricing: 'freemium',
    pricingDetails: 'Free plan supports unlimited mobile push up to 10k web push subscribers.',
    sdks: [
      { language: 'Node.js', package: '@onesignal/node-onesignal', installCommand: 'npm install @onesignal/node-onesignal' }
    ],
    quickstart: `import * as OneSignal from '@onesignal/node-onesignal';
const app_key_provider = { getToken() { return process.env.ONESIGNAL_REST_API_KEY!; } };
const client = new OneSignal.DefaultApi(OneSignal.createConfiguration({ authMethods: { app_key: { tokenProvider: app_key_provider } } }));

await client.createNotification({
  app_id: process.env.ONESIGNAL_APP_ID!,
  contents: { en: 'You have a new property viewing scheduled!' },
  included_segments: ['Subscribed Users'],
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/notifications',
        summary: 'Create Notification',
        description: 'Broadcasts push alert to target segment or external user IDs.'
      }
    ],
    useCases: ['Breaking updates & product alerts on mobile apps', 'Re-engagement campaigns', 'Transactional order status alerts'],
    alternatives: ['firebase-fcm', 'pusher', 'novu'],
    lastUpdated: '2026-02-20'
  }
];
