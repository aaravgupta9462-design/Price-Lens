import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Phase 1: Aggregator & Performance Configuration
  serpApiKey: process.env.SERPAPI_KEY || process.env.SERPAPI_API_KEY || '',
  cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '600', 10),
  adapterTimeoutMs: parseInt(process.env.ADAPTER_TIMEOUT_MS || '8000', 10),
  priceOutlierRatio: parseFloat(process.env.PRICE_OUTLIER_RATIO || '0.6'),
  priceOutlierMaxRatio: parseFloat(process.env.PRICE_OUTLIER_MAX_RATIO || '2.0'),

  // Adapter Feature Toggles (Phase 2 direct adapters default to false)
  enableSerpApi: process.env.ENABLE_SERPAPI !== 'false',
  enableAmazon: process.env.ENABLE_AMAZON === 'true',
  enableFlipkart: process.env.ENABLE_FLIPKART === 'true',
  enableCroma: process.env.ENABLE_CROMA !== 'false',
  enableRelianceDigital: process.env.ENABLE_RELIANCE_DIGITAL !== 'false',

  // Phase 2: Direct Retailer Affiliate Credentials
  // Amazon Creators API: https://affiliate-program.amazon.in/creatorsapi/docs
  amazonCredentialId: process.env.AMAZON_CREDENTIAL_ID || '',
  amazonCredentialSecret: process.env.AMAZON_CREDENTIAL_SECRET || '',
  amazonPartnerTag: process.env.AMAZON_PARTNER_TAG || '',
  // Legacy PA-API fallback credentials
  amazonAssociateTag: process.env.AMAZON_ASSOCIATE_TAG || '',
  amazonAccessKey: process.env.AMAZON_ACCESS_KEY || '',
  amazonSecretKey: process.env.AMAZON_SECRET_KEY || '',
  // Flipkart Affiliate API: https://affiliate.flipkart.com/api-docs/
  flipkartAffiliateId: process.env.FLIPKART_AFFILIATE_ID || '',
  flipkartAffiliateToken: process.env.FLIPKART_AFFILIATE_TOKEN || '',

  // Phase 3: Indian Affiliate Network Credentials (Cuelinks / INRDeals)
  cuelinksApiKey: process.env.CUELINKS_API_KEY || '',
  cuelinksPubId: process.env.CUELINKS_PUB_ID || '',
  inrdealsApiKey: process.env.INRDEALS_API_KEY || ''
};

export default config;
