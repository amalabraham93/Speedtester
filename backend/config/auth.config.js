// Simple config to keep secrets centralized if not in env
module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_dev_only',
    jwtExpire: '30d'
};
