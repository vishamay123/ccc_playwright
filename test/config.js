require('dotenv').config();

module.exports = {
    BASE_URL: process.env.BASE_URL || 'http://*******',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '*******',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '*********'
};
