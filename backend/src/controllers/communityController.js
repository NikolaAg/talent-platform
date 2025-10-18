const { Community, User, UserCommunity, Project, Event } = require('../models/associations');
const { Op } = require('sequelize');

exports.createCommunity = async (req, res) => {
  try {
    const { name, description, logo, tags, category, isPublic } = req.body;

    const community = await Community.create({
      name,
      description,
      logo,
      tags,
      category,
      isPublic,
      companyId: req.user.role === 'company' ? req.user.id : null
    });

    // Создатель становится администратором
    await UserCommunity.create({
      userId: req.user.id,
      communityId: community.id,
      role: 'admin'
    });

    await community.update({ memberCount: 1 });

    res.status(201).json({
      message: 'Сообщество успешно создано',
      community
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка создания сообщества: ' + error.message });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    const where = { isPublic: true };
    
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.contains]: [search] } }
      ];
    }

    const communities = await Community.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'Company',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      communities: communities.rows,
      totalCount: communities.count,
      totalPages: Math.ceil(communities.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения сообществ: ' + error.message });
  }
};

exports.getCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findByPk(id, {
      include: [
        {
          model: User,
          as: 'Company',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          through: { attributes: ['role', 'joinedAt'] },
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'rating', 'level']
        },
        {
          model: Project,
          limit: 5,
          order: [['createdAt', 'DESC']]
        },
        {
          model: Event,
          limit: 5,
          order: [['startDate', 'ASC']]
        }
      ]
    });

    if (!community) {
      return res.status(404).json({ error: 'Сообщество не найдено' });
    }

    // Проверяем, является ли пользователь участником
    const userMembership = await UserCommunity.findOne({
      where: { userId: req.user?.id, communityId: id }
    });

    res.json({
      community,
      userMembership: userMembership || null
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения сообщества: ' + error.message });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findByPk(id);
    if (!community) {
      return res.status(404).json({ error: 'Сообщество не найдено' });
    }

    const existingMembership = await UserCommunity.findOne({
      where: { userId: req.user.id, communityId: id }
    });

    if (existingMembership) {
      return res.status(400).json({ error: 'Вы уже являетесь участником этого сообщества' });
    }

    await UserCommunity.create({
      userId: req.user.id,
      communityId: id,
      role: 'member'
    });

    await community.increment('memberCount');

    res.json({ message: 'Вы успешно вступили в сообщество' });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка вступления в сообщество: ' + error.message });
  }
};

exports.leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await UserCommunity.findOne({
      where: { userId: req.user.id, communityId: id }
    });

    if (!membership) {
      return res.status(400).json({ error: 'Вы не являетесь участником этого сообщества' });
    }

    await membership.destroy();
    await Community.decrement('memberCount', { where: { id } });

    res.json({ message: 'Вы успешно покинули сообщество' });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка выхода из сообщества: ' + error.message });
  }
};

exports.getCommunityMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, search, page = 1, limit = 20 } = req.query;

    const where = { communityId: id };
    if (role) where.role = role;

    const members = await UserCommunity.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'skills', 'rating', 'level']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['role', 'ASC'], ['joinedAt', 'DESC']]
    });

    res.json({
      members: members.rows,
      totalCount: members.count,
      totalPages: Math.ceil(members.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения участников: ' + error.message });
  }
};
