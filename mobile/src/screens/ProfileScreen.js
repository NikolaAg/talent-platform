import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../store/slices/authSlice';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { clearAuthData } = useAuth();

  const handleLogout = async () => {
    await clearAuthData();
    dispatch(logout());
  };

  const stats = [
    { label: 'Завершенные проекты', value: '12', icon: 'briefcase-outline' },
    { label: 'Сообщества', value: '5', icon: 'people-outline' },
    { label: 'Мероприятия', value: '8', icon: 'calendar-outline' },
    { label: 'Рейтинг', value: '4.8', icon: 'star-outline' },
  ];

  const menuItems = [
    {
      title: 'Мои проекты',
      icon: 'folder-outline',
      onPress: () => console.log('Мои проекты'),
    },
    {
      title: 'Мои заявки',
      icon: 'document-text-outline',
      onPress: () => console.log('Мои заявки'),
    },
    {
      title: 'Настройки',
      icon: 'settings-outline',
      onPress: () => console.log('Настройки'),
    },
    {
      title: 'Помощь',
      icon: 'help-circle-outline',
      onPress: () => console.log('Помощь'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header с информацией пользователя */}
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Text>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Уровень {user?.level || 1}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Icon name="pencil-outline" size={20} color="#2563EB" />
          <Text style={styles.editButtonText}>Редактировать</Text>
        </TouchableOpacity>
      </View>

      {/* Статистика */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Статистика</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={styles.statIcon}>
                <Icon name={stat.icon} size={20} color="#2563EB" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Навыки */}
      {user?.skills && user.skills.length > 0 && (
        <View style={styles.skillsSection}>
          <Text style={styles.sectionTitle}>Навыки</Text>
          <View style={styles.skillsContainer}>
            {user.skills.slice(0, 6).map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
            {user.skills.length > 6 && (
              <View style={styles.moreSkillsTag}>
                <Text style={styles.moreSkillsText}>
                  +{user.skills.length - 6} еще
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Бейджи */}
      {user?.badges && user.badges.length > 0 && (
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Достижения</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.badgesContainer}>
              {user.badges.map((badge, index) => (
                <View key={index} style={styles.badgeItem}>
                  <View style={styles.badgeIcon}>
                    <Icon name="trophy-outline" size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Меню */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Аккаунт</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Icon name={item.icon} size={20} color="#64748B" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Выход */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutButtonText}>Выйти</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Платформа Талантов v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  statsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  skillsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  moreSkillsTag: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  moreSkillsText: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
  },
  badgesSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 1,
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    maxWidth: 80,
  },
  menuSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginTop: 12,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
