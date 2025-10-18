import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CommunityDetailScreen({ route, navigation }) {
  const { communityId } = route.params;
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  // Мок данные сообщества
  const mockCommunity = {
    id: communityId,
    name: 'AI Сообщество',
    description: 'Сообщество специалистов в области искусственного интеллекта и машинного обучения. Мы занимаемся исследованиями, разработкой проектов и обменом знаниями в сфере AI.',
    logo: null,
    category: 'ai',
    memberCount: 245,
    tags: ['AI', 'Machine Learning', 'Deep Learning', 'Python', 'Data Science'],
    isPublic: true,
    company: {
      firstName: 'Техно',
      lastName: 'Корп',
    },
    projects: [
      {
        id: '1',
        title: 'Система распознавания образов',
        status: 'open',
        difficulty: 'advanced',
      },
      {
        id: '2',
        title: 'Чат-бот с NLP',
        status: 'in_progress',
        difficulty: 'intermediate',
      },
    ],
    events: [
      {
        id: '1',
        title: 'Введение в нейронные сети',
        type: 'webinar',
        startDate: '2024-02-15T18:00:00Z',
      },
      {
        id: '2',
        title: 'Хакатон по компьютерному зрению',
        type: 'hackathon',
        startDate: '2024-03-01T10:00:00Z',
      },
    ],
    members: [
      {
        id: '1',
        firstName: 'Алексей',
        lastName: 'Иванов',
        avatar: null,
        role: 'admin',
        skills: ['Python', 'TensorFlow', 'PyTorch'],
      },
      {
        id: '2',
        firstName: 'Мария',
        lastName: 'Петрова',
        avatar: null,
        role: 'moderator',
        skills: ['Data Science', 'SQL', 'Statistics'],
      },
    ],
  };

  const [community, setCommunity] = useState(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    loadCommunity();
  }, [communityId]);

  const loadCommunity = async () => {
    setRefreshing(true);
    // Здесь будет загрузка с API
    setTimeout(() => {
      setCommunity(mockCommunity);
      setIsMember(true); // Для демонстрации
      setRefreshing(false);
    }, 1000);
  };

  const handleJoinCommunity = () => {
    // Здесь будет логика вступления в сообщество
    setIsMember(true);
  };

  const handleLeaveCommunity = () => {
    // Здесь будет логика выхода из сообщества
    setIsMember(false);
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity style={styles.projectItem}>
      <View style={styles.projectInfo}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <View style={styles.projectMeta}>
          <View style={[styles.statusBadge, 
            item.status === 'open' && styles.statusOpen,
            item.status === 'in_progress' && styles.statusInProgress
          ]}>
            <Text style={styles.statusText}>
              {item.status === 'open' ? 'Открыт' : 'В работе'}
            </Text>
          </View>
          <Text style={styles.difficultyText}>
            {item.difficulty === 'beginner' ? 'Начинающий' : 
             item.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
          </Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );

  const renderEventItem = ({ item }) => (
    <TouchableOpacity style={styles.eventItem}>
      <View style={styles.eventDate}>
        <Text style={styles.eventDay}>
          {new Date(item.startDate).getDate()}
        </Text>
        <Text style={styles.eventMonth}>
          {new Date(item.startDate).toLocaleString('ru-RU', { month: 'short' })}
        </Text>
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventType}>
          {item.type === 'webinar' ? 'Вебинар' : 
           item.type === 'hackathon' ? 'Хакатон' : 'Мероприятие'}
        </Text>
        <Text style={styles.eventTime}>
          {new Date(item.startDate).toLocaleString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberInitial}>
          {item.firstName.charAt(0)}{item.lastName.charAt(0)}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.memberRole}>
          {item.role === 'admin' ? 'Администратор' : 
           item.role === 'moderator' ? 'Модератор' : 'Участник'}
        </Text>
        {item.skills && item.skills.length > 0 && (
          <Text style={styles.memberSkills}>
            {item.skills.slice(0, 2).join(', ')}
            {item.skills.length > 2 && '...'}
          </Text>
        )}
      </View>
    </View>
  );

  if (!community) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadCommunity}
            colors={['#2563EB']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.communityHeader}>
            <View style={styles.logoContainer}>
              {community.logo ? (
                <Image source={{ uri: community.logo }} style={styles.logo} />
              ) : (
                <Text style={styles.logoPlaceholder}>
                  {community.name.charAt(0)}
                </Text>
              )}
            </View>
            <View style={styles.communityInfo}>
              <Text style={styles.communityName}>{community.name}</Text>
              <Text style={styles.memberCount}>
                {community.memberCount} участников
              </Text>
              <Text style={styles.companyName}>
                от {community.company.firstName} {community.company.lastName}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              isMember ? styles.leaveButton : styles.joinButton
            ]}
            onPress={isMember ? handleLeaveCommunity : handleJoinCommunity}
          >
            <Text style={styles.actionButtonText}>
              {isMember ? 'Вы участник' : 'Вступить'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.tabActive]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
              О сообществе
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'projects' && styles.tabActive]}
            onPress={() => setActiveTab('projects')}
          >
            <Text style={[styles.tabText, activeTab === 'projects' && styles.tabTextActive]}>
              Проекты
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && styles.tabActive]}
            onPress={() => setActiveTab('events')}
          >
            <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>
              Мероприятия
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'members' && styles.tabActive]}
            onPress={() => setActiveTab('members')}
          >
            <Text style={[styles.tabText, activeTab === 'members' && styles.tabTextActive]}>
              Участники
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'about' && (
            <View>
              <Text style={styles.sectionTitle}>Описание</Text>
              <Text style={styles.description}>
                {community.description}
              </Text>

              {community.tags && community.tags.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Теги</Text>
                  <View style={styles.tagsContainer}>
                    {community.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          )}

          {activeTab === 'projects' && (
            <View>
              <Text style={styles.sectionTitle}>Активные проекты</Text>
              {community.projects && community.projects.length > 0 ? (
                <FlatList
                  data={community.projects}
                  renderItem={renderProjectItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.emptyText}>Пока нет активных проектов</Text>
              )}
            </View>
          )}

          {activeTab === 'events' && (
            <View>
              <Text style={styles.sectionTitle}>Ближайшие мероприятия</Text>
              {community.events && community.events.length > 0 ? (
                <FlatList
                  data={community.events}
                  renderItem={renderEventItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.emptyText}>Пока нет запланированных мероприятий</Text>
              )}
            </View>
          )}

          {activeTab === 'members' && (
            <View>
              <Text style={styles.sectionTitle}>Участники сообщества</Text>
              {community.members && community.members.length > 0 ? (
                <FlatList
                  data={community.members}
                  renderItem={renderMemberItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.emptyText}>Пока нет участников</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    textAlign: 'center',
    lineHeight: 80,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#94A3B8',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#2563EB',
  },
  leaveButton: {
    backgroundColor: '#F1F5F9',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  leaveButtonText: {
    color: '#64748B',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#2563EB',
  },
  content: {
    padding: 20,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#475569',
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  projectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  statusOpen: {
    backgroundColor: '#D1FAE5',
  },
  statusInProgress: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  difficultyText: {
    fontSize: 12,
    color: '#64748B',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  eventDate: {
    width: 50,
    alignItems: 'center',
    marginRight: 16,
  },
  eventDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  eventMonth: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'lowercase',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  eventType: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  memberSkills: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
