import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

export default function FeedScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector(state => state.auth);
  const [feedItems, setFeedItems] = useState([]);

  // Заглушка данных для ленты
  const mockFeedData = [
    {
      id: '1',
      type: 'project',
      title: 'Новый проект по машинному обучению',
      description: 'Ищем разработчиков для создания системы компьютерного зрения',
      community: 'AI Сообщество',
      timestamp: '2 часа назад',
    },
    {
      id: '2',
      type: 'event',
      title: 'Хакатон по робототехнике',
      description: 'Примите участие в нашем ежегодном хакатоне по робототехнике',
      community: 'Робототехника',
      timestamp: '5 часов назад',
    },
    {
      id: '3',
      type: 'community',
      title: 'Новое сообщество: Генная инженерия',
      description: 'Присоединяйтесь к обсуждению последних достижений в генной инженерии',
      community: 'Генная инженерия',
      timestamp: '1 день назад',
    },
  ];

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setRefreshing(true);
    // Здесь будет загрузка данных с API
    setTimeout(() => {
      setFeedItems(mockFeedData);
      setRefreshing(false);
    }, 1000);
  };

  const renderFeedItem = ({ item }) => (
    <TouchableOpacity style={styles.feedItem}>
      <View style={styles.feedHeader}>
        <View style={styles.communityInfo}>
          <View style={styles.communityAvatar}>
            <Text style={styles.communityInitial}>
              {item.community.charAt(0)}
            </Text>
          </View>
          <View>
            <Text style={styles.communityName}>{item.community}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>
            {item.type === 'project' ? 'Проект' : 
             item.type === 'event' ? 'Мероприятие' : 'Сообщество'}
          </Text>
        </View>
      </View>

      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>

      <View style={styles.feedActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="heart-outline" size={20} color="#64748B" />
          <Text style={styles.actionText}>12</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chatbubble-outline" size={20} color="#64748B" />
          <Text style={styles.actionText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share-social-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Лента активностей</Text>
        <Text style={styles.headerSubtitle}>
          Добро пожаловать, {user?.firstName}!
        </Text>
      </View>

      <FlatList
        data={feedItems}
        renderItem={renderFeedItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadFeed}
            colors={['#2563EB']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="newspaper-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>Пока нет активностей</Text>
            <Text style={styles.emptyStateText}>
              Подпишитесь на сообщества, чтобы видеть их активность здесь
            </Text>
          </View>
        }
      />
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
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
  feedList: {
    padding: 16,
  },
  feedItem: {
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
  feedHeader: {
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  typeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  feedActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    color: '#64748B',
    fontSize: 14,
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
