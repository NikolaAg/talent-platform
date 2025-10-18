const User = require('./User');
const Community = require('./Community');
const Project = require('./Project');
const Event = require('./Event');
const Application = require('./Application');
const Message = require('./Message');
const Badge = require('./Badge');

// User-Community (Многие-ко-многим через UserCommunity)
const UserCommunity = require('./UserCommunity');

User.belongsToMany(Community, { through: UserCommunity, foreignKey: 'userId' });
Community.belongsToMany(User, { through: UserCommunity, foreignKey: 'communityId' });
Community.belongsTo(User, { as: 'Company', foreignKey: 'companyId' });

// User-Project (Многие-ко-многим через Application)
User.belongsToMany(Project, { through: Application, foreignKey: 'userId' });
Project.belongsToMany(User, { through: Application, foreignKey: 'projectId' });
Project.belongsTo(Community, { foreignKey: 'communityId' });
Project.belongsTo(User, { as: 'Creator', foreignKey: 'createdBy' });

// User-Event (Многие-ко-многим через UserEvent)
const UserEvent = require('./UserEvent');
User.belongsToMany(Event, { through: UserEvent, foreignKey: 'userId' });
Event.belongsToMany(User, { through: UserEvent, foreignKey: 'eventId' });
Event.belongsTo(Community, { foreignKey: 'communityId' });

// Отношения для чата
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });
Message.belongsTo(Community, { foreignKey: 'communityId' });

// Бейджи
User.belongsToMany(Badge, { through: 'UserBadges', foreignKey: 'userId' });
Badge.belongsToMany(User, { through: 'UserBadges', foreignKey: 'badgeId' });

module.exports = {
  User,
  Community,
  Project,
  Event,
  Application,
  Message,
  Badge,
  UserCommunity,
  UserEvent
};
