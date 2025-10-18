const { User, Project, Application, Community, UserCommunity } = require('../models/associations');
const { Op } = require('sequelize');

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Project,
          through: { attributes: ['status', 'createdAt'] },
          attributes: ['id', 'title', 'difficulty', 'status']
        },
        {
          model: Community,
          through: { attributes: ['role', 'joinedAt'] },
          attributes: ['id', 'name', 'logo']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения профиля пользователя: ' + error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { skills, search, page = 1, limit = 10 } = req.query;

    const where = {};
    
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      where.skills = { [Op.overlap]: skillsArray };
    }

    const users = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Community,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['rating', 'DESC'], ['level', 'DESC']]
    });

    res.json({
      users: users.rows,
      totalCount: users.count,
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка поиска пользователей: ' + error.message });
  }
};

exports.updateUserSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    await req.user.update({ skills });

    res.json({ 
      message: 'Навыки успешно обновлены',
      skills: req.user.skills 
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка обновления навыков: ' + error.message });
  }
};

exports.addBadge = async (req, res) => {
  try {
    const { userId } = req.params;
    const { badgeId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const badge = await require('../models/Badge').findByPk(badgeId);
    if (!badge) {
      return res.status(404).json({ error: 'Бейдж не найден' });
    }

    await user.addBadge(badge);

    // Обновляем массив бейджей пользователя
    const userBadges = await user.getBadges();
    await user.update({
      badges: userBadges.map(b => ({
        id: b.id,
        name: b.name,
        icon: b.icon,
        category: b.category
      }))
    });

    res.json({ message: 'Бейдж успешно добавлен', badges: user.badges });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка добавления бейджа: ' + error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const completedProjects = await Application.count({
      where: { userId, status: 'completed' }
    });

    const communitiesCount = await UserCommunity.count({
      where: { userId }
    });

    const eventsAttended = await require('../models/UserEvent').count({
      where: { userId, status: 'attended' }
    });

    res.json({
      stats: {
        completedProjects,
        communitiesCount,
        eventsAttended,
        rating: req.user.rating,
        level: req.user.level
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения статистики: ' + error.message });
  }
};
