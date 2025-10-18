import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [project, setProject] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');

  // Мок данные проекта
  const mockProject = {
    id: projectId,
    title: 'Разработка системы компьютерного зрения',
    description: 'Мы ищем талантливых разработчиков для создания системы компьютерного зрения для промышленного использования. Проект включает в себя разработку алгоритмов распознавания объектов, обучение нейронных сетей и интеграцию с существующей инфраструктурой.',
    requirements: [
      'Опыт работы с Python',
      'Знание OpenCV и TensorFlow/PyTorch',
      'Понимание принципов компьютерного зрения',
      'Опыт работы с нейронными сетями',
    ],
    difficulty: 'advanced',
    status: 'open',
    budget: 50000,
    deadline: '2024-03-15',
    tags: ['AI', 'Computer Vision', 'Python', 'Deep Learning'],
    community: {
      id: '1',
      name: 'AI Сообщество',
      logo: null,
    },
    creator: {
      id: '1',
      firstName: 'Алексей',
      lastName: 'Иванов',
      avatar: null,
    },
    applicationsCount: 8,
    createdAt: '2024-01-15T10:00:00Z',
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setRefreshing(true);
    // Здесь будет загрузка с API
    setTimeout(() => {
      setProject(mockProject);
      setRefreshing(false);
    }, 1000);
  };

  const handleApply = () => {
    if (!applicationMessage.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, напишите сопроводительное письмо');
      return;
    }

    // Здесь будет отправка заявки на API
    setHasApplied(true);
    setShowApplicationForm(false);
    setApplicationMessage('');
    Alert.alert('Успех', 'Ваша заявка отправлена!');
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

  if (!project) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Загрузка проекта...</Text>
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
            onRefresh={loadProject}
            colors={['#2563EB']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.communityInfo}>
            <View style={styles.communityAvatar}>
              <Text style={styles.communityInitial}>
                {project.community.name.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={styles.communityName}>{project.community.name}</Text>
              <Text style={styles.creatorName}>
                от {project.creator.firstName} {project.creator.lastName}
              </Text>
            </View>
          </View>

          <View style={styles.statusSection}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
              <Text style={styles.statusText}>{getStatusText(project.status)}</Text>
            </View>
            <Text style={styles.applicationsCount}>
              {project.applicationsCount} заявок
            </Text>
          </View>
        </View>

        {/* Project Info */}
        <View style={styles.content}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Icon name="flag-outline" size={16} color="#64748B" />
              <Text style={[styles.metaText, { color: getDifficultyColor(project.difficulty) }]}>
                {getDifficultyText(project.difficulty)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="calendar-outline" size={16} color="#64748B" />
              <Text style={styles.metaText}>
                До {new Date(project.deadline).toLocaleDateString('ru-RU')}
              </Text>
            </View>
            {project.budget > 0 && (
              <View style={styles.metaItem}>
                <Icon name="cash-outline" size={16} color="#64748B" />
                <Text style={styles.metaText}>
                  {project.budget.toLocaleString('ru-RU')} ₽
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Описание проекта</Text>
            <Text style={styles.description}>{project.description}</Text>
          </View>

          {/* Requirements */}
          {project.requirements && project.requirements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Требования</Text>
              {project.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Icon name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Теги</Text>
              <View style={styles.tagsContainer}>
                {project.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Application Form */}
          {showApplicationForm && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Подача заявки</Text>
              <Text style={styles.applicationLabel}>
                Расскажите, почему вы подходите для этого проекта:
              </Text>
              <TextInput
                style={styles.applicationInput}
                multiline
                numberOfLines={6}
                placeholder="Опишите ваш опыт, навыки и почему вы хотите работать над этим проектом..."
                value={applicationMessage}
                onChangeText={setApplicationMessage}
                textAlignVertical="top"
              />
              <View style={styles.applicationActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowApplicationForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleApply}
                >
                  <Text style={styles.submitButtonText}>Отправить заявку</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Action Button */}
      {project.status === 'open' && !hasApplied && !showApplicationForm && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowApplicationForm(true)}
          >
            <Text style={styles.applyButtonText}>Подать заявку</Text>
          </TouchableOpacity>
        </View>
      )}

      {hasApplied && (
        <View style={styles.footer}>
          <View style={styles.appliedBadge}>
            <Icon name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.appliedText}>Заявка отправлена</Text>
          </View>
        </View>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  communityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  communityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  communityInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  creatorName: {
    fontSize: 14,
    color: '#64748B',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  applicationsCount: {
    fontSize: 12,
    color: '#64748B',
  },
  content: {
    padding: 20,
    backgroundColor: 'white',
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
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
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
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
  applicationLabel: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  applicationInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 120,
  },
  applicationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#64748B',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  applyButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  appliedText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
