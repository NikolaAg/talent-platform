const jwt = require('jsonwebtoken');
const { User } = require('../models/associations');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Доступ запрещен. Токен не предоставлен.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Неверный токен.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Неверный токен.' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findByPk(decoded.userId);
      req.user = user;
    }
    
    next();
  } catch (error) {
    next();
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется аутентификация.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Недостаточно прав.' });
    }

    next();
  };
};

module.exports = { auth, optionalAuth, requireRole };
