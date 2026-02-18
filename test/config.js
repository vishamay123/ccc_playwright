require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://52.91.192.7';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Warn if any value is still the hardcoded default (optional safety check)
if (!process.env.BASE_URL) console.warn('[config] BASE_URL not set in .env, using default');
if (!process.env.ADMIN_EMAIL) console.warn('[config] ADMIN_EMAIL not set in .env, using default');
if (!process.env.ADMIN_PASSWORD) console.warn('[config] ADMIN_PASSWORD not set in .env, using default');

module.exports = { BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD };