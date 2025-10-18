const jwt = require('jsonwebtoken');
const { User } = require('../models/associations');
const { Op } = require('sequelize');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, skills } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'student',
      skills: skills || []
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Пользователь успешно создан',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        skills: user.skills,
        rating: user.rating,
        level: user.level
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при создании пользователя: ' + error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        skills: user.skills,
        rating: user.rating,
        level: user.level,
        badges: user.badges
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при входе: ' + error.message });
  }
};

exports.vkAuth = async (req, res) => {
  try {
    const { vkId, email, firstName, lastName, avatar } = req.body;

    let user = await User.findOne({
      where: {
        [Op.or]: [{ vkId }, { email }]
      }
    });

    if (!user) {
      user = await User.create({
        vkId,
        email,
        firstName,
        lastName,
        avatar,
        isVerified: true
      });
    } else if (!user.vkId) {
      user.vkId = vkId;
      await user.save();
    }

    const token = generateToken(user.id);

    res.json({
      message: 'VK аутентификация успешна',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        skills: user.skills,
        rating: user.rating,
        level: user.level,
        badges: user.badges
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка VK аутентификации: ' + error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения профиля: ' + error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, skills, experience } = req.body;
    
    await req.user.update({
      firstName,
      lastName,
      bio,
      skills,
      experience
    });

    res.json({ message: 'Профиль успешно обновлен', user: req.user });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка обновления профиля: ' + error.message });
  }
};
