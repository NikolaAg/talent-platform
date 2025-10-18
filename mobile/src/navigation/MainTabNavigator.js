import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Импорт экранов
import FeedScreen from '../screens/FeedScreen';
import CommunitiesScreen from '../screens/CommunitiesScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommunityDetailScreen from '../screens/CommunityDetailScreen';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CommunitiesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="CommunitiesList" 
      component={CommunitiesScreen}
      options={{ title: 'Сообщества' }}
    />
    <Stack.Screen 
      name="CommunityDetail" 
      component={CommunityDetailScreen}
      options={{ title: 'Сообщество' }}
    />
  </Stack.Navigator>
);

const ProjectsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ProjectsList" 
      component={ProjectsScreen}
      options={{ title: 'Проекты' }}
    />
    <Stack.Screen 
      name="ProjectDetail" 
      component={ProjectDetailScreen}
      options={{ title: 'Проект' }}
    />
  </Stack.Navigator>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Лента') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Сообщества') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Проекты') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Профиль') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Лента" component={FeedScreen} />
      <Tab.Screen name="Сообщества" component={CommunitiesStack} />
      <Tab.Screen name="Проекты" component={ProjectsStack} />
      <Tab.Screen name="Профиль" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
