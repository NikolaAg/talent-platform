const { Message, User, Community } = require('../models/associations');
const { Op } = require('sequelize');

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id },
          { communityId: { [Op.in]: await getUsersCommunities(req.user.id) } }
        ]
      },
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          as: 'Receiver',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: Community,
          attributes: ['id', 'name', 'logo']
        }
      ],
      order: [['createdAt', 'DESC']],
      group: ['communityId', 'receiverId', 'senderId']
    });

    // Группируем сообщения по диалогам
    const conversationMap = new Map();

    conversations.forEach(msg => {
      const convoId = msg.communityId 
        ? `community_${msg.communityId}`
        : `direct_${[msg.senderId, msg.receiverId].sort().join('_')}`;

      if (!conversationMap.has(convoId)) {
        conversationMap.set(convoId, {
          id: convoId,
          type: msg.communityId ? 'community' : 'direct',
          community: msg.Community,
          participants: msg.communityId ? null : [
            msg.Sender.id === req.user.id ? msg.Receiver : msg.Sender,
            msg.Sender
          ].filter(p => p.id !== req.user.id),
          lastMessage: msg,
          unreadCount: 0
        });
      }
    });

    res.json({ conversations: Array.from(conversationMap.values()) });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения диалогов: ' + error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    let where = {};

    if (conversationId.startsWith('community_')) {
      const communityId = conversationId.replace('community_', '');
      where.communityId = communityId;
    } else {
      const userIds = conversationId.replace('direct_', '').split('_');
      where = {
        [Op.or]: [
          { senderId: userIds[0], receiverId: userIds[1] },
          { senderId: userIds[1], receiverId: userIds[0] }
        ],
        communityId: null
      };
    }

    const messages = await Message.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    // Отмечаем сообщения как прочитанные
    await Message.update(
      { isRead: true },
      {
        where: {
          ...where,
          receiverId: req.user.id,
          isRead: false
        }
      }
    );

    res.json({
      messages: messages.rows.reverse(),
      totalCount: messages.count,
      totalPages: Math.ceil(messages.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка получения сообщений: ' + error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content, receiverId, communityId, messageType = 'text', fileUrl } = req.body;

    const message = await Message.create({
      content,
      senderId: req.user.id,
      receiverId: receiverId || null,
      communityId: communityId || null,
      messageType,
      fileUrl
    });

    const messageWithSender = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    // Отправляем через Socket.io
    req.app.get('io').to(getRoomId(receiverId, communityId)).emit('receive_message', messageWithSender);

    res.status(201).json({
      message: 'Сообщение успешно отправлено',
      message: messageWithSender
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка отправки сообщения: ' + error.message });
  }
};

// Вспомогательные функции
async function getUsersCommunities(userId) {
  const userCommunities = await require('../models/UserCommunity').findAll({
    where: { userId },
    attributes: ['communityId']
  });
  return userCommunities.map(uc => uc.communityId);
}

function getRoomId(receiverId, communityId) {
  return communityId ? `community_${communityId}` : `direct_${receiverId}`;
}
