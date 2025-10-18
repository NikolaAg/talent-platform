const { Event, User, UserEvent, Community } = require('../models/associations');
const { Op } = require('sequelize');

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      startDate,
      endDate,
      location,
      isOnline,
      maxParticipants,
      price,
      communityId
    } = req.body;

    const event = await Event.create({
      title,
      description,
      type,
      startDate,
      endDate,
      location,
      isOnline,
      maxParticipants,
      price,
      communityId
    });

    res.status(201).json({
      message: 'Мероприятие успешно создано',
      event
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка создания мероприятия: ' + error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const {
      type,
      communityId,
      isOnline,
      upcoming,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const where = {};
    
    if (type) where.type = type;
    if (communityId) where.communityId = communityId;
    if (isOnline !== undefined) where.isOnline = isOnline === 'true';
    
    if (upcoming === 'true') {
      where.startDate = { [Op.gte]: new Date() };
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const events = await Event.findAndCountAll({
      where,
      include: [
        {
          model: Community,
          attributes: ['id', 'name', 'logo']
        },
        {
          model: User,
          through: { attributes: ['status'] },
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['startDate', 'ASC']]
    });

    res.json({
      events: events.rows,
      totalCount: events.count,
      totalPages: Math.ceil(events.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения мероприятий: ' + error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: Community,
          attributes: ['id', 'name', 'logo']
        },
        {
          model: User,
          through: { attributes: ['status', 'rating'] },
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    let userRegistration = null;
    if (req.user) {
      userRegistration = await UserEvent.findOne({
        where: { userId: req.user.id, eventId: id }
      });
    }

    res.json({
      event,
      userRegistration
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения мероприятия: ' + error.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    // Проверяем, не заполнено ли мероприятие
    const currentParticipants = await UserEvent.count({
      where: { eventId: id }
    });

    if (event.maxParticipants && currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ error: 'Мероприятие полностью заполнено' });
    }

    const existingRegistration = await UserEvent.findOne({
      where: { userId: req.user.id, eventId: id }
    });

    if (existingRegistration) {
      return res.status(400).json({ error: 'Вы уже зарегистрированы на это мероприятие' });
    }

    await UserEvent.create({
      userId: req.user.id,
      eventId: id,
      status: 'registered'
    });

    res.json({ message: 'Вы успешно зарегистрировались на мероприятие' });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка регистрации на мероприятие: ' + error.message });
  }
};

exports.updateEventAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, status, rating } = req.body;

    const registration = await UserEvent.findOne({
      where: { userId, eventId: id }
    });

    if (!registration) {
      return res.status(404).json({ error: 'Регистрация не найдена' });
    }

    await registration.update({ status, rating });

    res.json({ message: 'Посещаемость успешно обновлена', registration });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка обновления посещаемости: ' + error.message });
  }
};
