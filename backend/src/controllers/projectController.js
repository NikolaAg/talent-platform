const { Project, Application, User, Community } = require('../models/associations');
const { Op } = require('sequelize');

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      difficulty,
      deadline,
      budget,
      tags,
      communityId
    } = req.body;

    const project = await Project.create({
      title,
      description,
      requirements,
      difficulty,
      deadline,
      budget,
      tags,
      communityId,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Проект успешно создан',
      project
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка создания проекта: ' + error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const {
      status,
      difficulty,
      communityId,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const where = {};
    
    if (status) where.status = status;
    if (difficulty) where.difficulty = difficulty;
    if (communityId) where.communityId = communityId;
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.contains]: [search] } }
      ];
    }

    const projects = await Project.findAndCountAll({
      where,
      include: [
        {
          model: Community,
          attributes: ['id', 'name', 'logo']
        },
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          through: { attributes: ['status', 'message'] },
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      projects: projects.rows,
      totalCount: projects.count,
      totalPages: Math.ceil(projects.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения проектов: ' + error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: [
        {
          model: Community,
          attributes: ['id', 'name', 'logo']
        },
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          through: { attributes: ['id', 'status', 'message', 'proposal', 'createdAt'] },
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'rating', 'skills']
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    // Проверяем, подавал ли пользователь заявку
    let userApplication = null;
    if (req.user) {
      userApplication = await Application.findOne({
        where: { userId: req.user.id, projectId: id }
      });
    }

    res.json({
      project,
      userApplication
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения проекта: ' + error.message });
  }
};

exports.applyToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, proposal } = req.body;

    const project = await Project.findByPk(id);
    if (!project || project.status !== 'open') {
      return res.status(400).json({ error: 'Проект недоступен для подачи заявок' });
    }

    const existingApplication = await Application.findOne({
      where: { userId: req.user.id, projectId: id }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Вы уже подали заявку на этот проект' });
    }

    const application = await Application.create({
      userId: req.user.id,
      projectId: id,
      message,
      proposal,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Заявка успешно подана',
      application
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка подачи заявки: ' + error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findByPk(applicationId, {
      include: [Project]
    });

    if (!application) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    // Проверяем, принадлежит ли проект пользователю
    if (application.Project.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Недостаточно прав для обновления заявки' });
    }

    await application.update({ status });

    // Если принята, закрываем проект
    if (status === 'accepted') {
      await application.Project.update({ status: 'in_progress' });
    }

    res.json({ message: 'Статус заявки успешно обновлен', application });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка обновления заявки: ' + error.message });
  }
};
