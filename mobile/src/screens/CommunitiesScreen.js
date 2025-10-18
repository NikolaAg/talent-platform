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
import { fetchCommunities, joinCommunity } from '../store/slices/communitiesSlice';

export default function CommunitiesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const dispatch = useDispatch();
  const { list: communities, isLoading, error } = useSelector(state => state.communities);

  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'ai', name: 'ИИ' },
    { id: 'digital_twins', name: 'Цифровые двойники' },
    { id: 'robotics', name: 'Робототехника' },
    { id: 'genetics', name: 'Генная инженерия' },
    { id: 'chemistry', name: 'Химия' },
    { id: 'microchips', name: 'Микросхемы' },
  ];

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = () => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (selectedCategory !== 'all') filters.category = selectedCategory;
    
    dispatch(fetchCommunities(filters));
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      const result = await dispatch(joinCommunity(communityId));
      if (joinCommunity.fulfilled.match(result)) {
        // Сообщество успешно присоединено
      }
    } catch (error) {
      console.log('Ошибка вступления в сообщество:', error);
    }
  };

  const renderCommunityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.communityCard}
      onPress={() => navigation.navigate('CommunityDetail', { communityId: item.id })}
    >
      <View style={styles.communityHeader}>
        <View style={styles.communityImage}>
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={styles.logo} />
          ) : (
            <Text style={styles.logoPlaceholder}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.communityInfo}>
          <Text style={styles.communityName}>{item.name}</Text>
          <Text style={styles.communityCategory}>
            {categories.find(cat => cat.id === item.category)?.name || 'Другое'}
          </Text>
          <Text style={styles.memberCount}>
            {item.memberCount} участников
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.joinButton,
            item.userMembership && styles.joinedButton
          ]}
          onPress={() => handleJoinCommunity(item.id)}
          disabled={item.userMembership}
        >
          <Text style={[
            styles.joinButtonText,
            item.userMembership && styles.joinedButtonText
          ]}>
            {item.userMembership ? 'Вы вступили' : 'Вступить'}
          </Text>
        </TouchableOpacity>
      </View>

      {item.description && (
        <Text style={styles.communityDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Сообщества</Text>
        <Text style={styles.headerSubtitle}>
          Найдите сообщества по вашим интересам
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск сообществ..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={loadCommunities}
          />
        </View>
        
        <TouchableOpacity style={styles.createButton}>
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesSection}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item.id && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item.id && styles.categoryTextActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Загрузка сообществ...</Text>
        </View>
      ) : (
        <FlatList
          data={communities}
          renderItem={renderCommunityItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadCommunities}
              colors={['#2563EB']}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.communitiesList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="people-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyStateTitle}>Сообщества не найдены</Text>
              <Text style={styles.emptyStateText}>
                Попробуйте изменить параметры поиска или создать новое сообщество
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
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  createButton: {
    width: 48,
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesSection: {
    backgroundColor: 'white',
    paddingVertical: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  communitiesList: {
    padding: 16,
  },
  communityCard: {
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
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  communityImage: {
    marginRight: 12,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    textAlign: 'center',
    lineHeight: 50,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  communityCategory: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  memberCount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  joinedButton: {
    backgroundColor: '#F1F5F9',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  joinedButtonText: {
    color: '#64748B',
  },
  communityDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
