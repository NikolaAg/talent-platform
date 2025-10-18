import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProjectsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const statusFilters = [
    { id: 'all', name: 'Все' },
    { id: 'open', name: 'Открытые' },
    { id: 'in_progress', name: 'В работе' },
    { id: 'completed', name: 'Завершенные' },
  ];

  const difficultyFilters = [
    { id: 'all', name: 'Любая' },
    { id: 'beginner', name: 'Начинающий' },
    { id: 'intermediate', name: 'Средний' },
    { id: 'advanced', name: 'Продвинутый' },
  ];

  // Мок данные проектов
  const mockProjects = [
    {
      id: '1',
      title: 'Разработка системы компьютерного зрения',
      description: 'Создание системы распознавания объектов для промышленного использования',
      difficulty: 'advanced',
      status: 'open',
      budget: 50000,
      deadline: '2024-03-15',
      tags: ['AI', 'Computer Vision', 'Python'],
      community: {
        name: 'AI Сообщество',
        logo: null,
      },
      applicationsCount: 8,
    },
    {
      id: '2',
      title: 'Создание цифрового двойника производства',
      description: 'Разработка виртуальной модели производственного процесса',
      difficulty: 'intermediate',
      status: 'open',
      budget: 75000,
      deadline: '2024-04-01',
      tags: ['Digital Twins', 'Simulation', '3D'],
      community: {
        name: 'Цифровые двойники',
        logo: null,
      },
      applicationsCount: 3,
    },
    {
      id: '3',
      title: 'Оптимизация роботизированной сварки',
      description: 'Улучшение алгоритмов управления роботами-сварщиками',
      difficulty: 'advanced',
      status: 'in_progress',
      budget: 0,
      deadline: '2024-02-28',
      tags: ['Robotics', 'Automation', 'Welding'],
      community: {
        name: 'Робототехника',
        logo: null,
      },
      applicationsCount: 0,
    },
  ];

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setRefreshing(true);
    // Здесь будет загрузка с API
    setTimeout(() => {
      setProjects(mockProjects);
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#10B981';
      case 'in_progress': return '#F59E0B';
      case 'completed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Открыт';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершен';
      default: return status;
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Начинающий';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Продвинутый';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
    >
      <View style={styles.projectHeader}>
        <View style={styles.communityInfo}>
          <View style={styles.communityAvatar}>
            <Text style={styles.communityInitial}>
              {item.community.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.communityName}>{item.community.name}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.projectTitle}>{item.title}</Text>
      <Text style={styles.projectDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.projectMeta}>
        <View style={styles.metaItem}>
          <Icon name="flag-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>
            {getDifficultyText(item.difficulty)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="calendar-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>
            {new Date(item.deadline).toLocaleDateString('ru-RU')}
          </Text>
        </View>
        {item.budget > 0 && (
          <View style={styles.metaItem}>
            <Icon name="cash-outline" size={16} color="#64748B" />
            <Text style={styles.metaText}>
              {item.budget.toLocaleString('ru-RU')} ₽
            </Text>
          </View>
        )}
      </View>

      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.projectFooter}>
        <View style={styles.applicationsInfo}>
          <Icon name="people-outline" size={16} color="#64748B" />
          <Text style={styles.applicationsText}>
            {item.applicationsCount} заявок
          </Text>
        </View>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>
            {item.status === 'open' ? 'Подать заявку' : 'Посмотреть'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Проекты</Text>
        <Text style={styles.headerSubtitle}>
          Найдите интересные проекты для участия
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск проектов..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersSection}>
        <Text style={styles.filtersTitle}>Статус:</Text>
        <FlatList
          horizontal
          data={statusFilters}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedStatus === item.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedStatus(item.id)}
            >
              <Text style={[
                styles.filterText,
                selectedStatus === item.id && styles.filterTextActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      <View style={styles.filtersSection}>
        <Text style={styles.filtersTitle}>Сложность:</Text>
        <FlatList
          horizontal
          data={difficultyFilters}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedDifficulty === item.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedDifficulty(item.id)}
            >
              <Text style={[
                styles.filterText,
                selectedDifficulty === item.id && styles.filterTextActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {refreshing && projects.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Загрузка проектов...</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadProjects}
              colors={['#2563EB']}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.projectsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="briefcase-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyStateTitle}>Проекты не найдены</Text>
              <Text style={styles.emptyStateText}>
                Попробуйте изменить параметры поиска или создать новый проект
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  searchSection: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filtersSection: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filtersList: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  projectsList: {
    padding: 16,
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  communityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  communityAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  communityInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  communityName: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#475569',
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicationsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicationsText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  applyButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
