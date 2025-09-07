import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  Avatar,
  Badge,
  FAB,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../../../src/hooks/useAuth';
import { useNotifications } from '../../../src/hooks/useNotifications';
import { GRIEVANCE_CATEGORIES, POINTS_SYSTEM } from '../../../src/constants';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalGrievances: 0,
    resolvedGrievances: 0,
    pendingGrievances: 0,
    totalPoints: user?.points || 0,
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    // Simulate API call
    setStats({
      totalGrievances: 12,
      resolvedGrievances: 8,
      pendingGrievances: 4,
      totalPoints: user?.points || 0,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserStats();
    setRefreshing(false);
  };

  const getRewardTier = (points: number) => {
    if (points >= 1001) return { name: 'Platinum', color: '#E5E4E2', icon: '🏆' };
    if (points >= 501) return { name: 'Gold', color: '#FFD700', icon: '🥇' };
    if (points >= 101) return { name: 'Silver', color: '#C0C0C0', icon: '🥈' };
    return { name: 'Bronze', color: '#CD7F32', icon: '🥉' };
  };

  const tier = getRewardTier(stats.totalPoints);

  const quickActions = [
    {
      id: 'submit',
      title: 'Submit Grievance',
      subtitle: 'Report an issue',
      icon: 'plus-circle',
      color: '#2E7D32',
      onPress: () => navigation.navigate('Submit'),
    },
    {
      id: 'track',
      title: 'Track Grievance',
      subtitle: 'Check status',
      icon: 'clipboard-list',
      color: '#1976D2',
      onPress: () => navigation.navigate('Track'),
    },
    {
      id: 'rewards',
      title: 'Rewards',
      subtitle: 'View benefits',
      icon: 'trophy',
      color: '#FF9800',
      onPress: () => navigation.navigate('Rewards'),
    },
    {
      id: 'feedback',
      title: 'Give Feedback',
      subtitle: 'Rate services',
      icon: 'star',
      color: '#9C27B0',
      onPress: () => {
        // Navigate to feedback screen
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Avatar.Text
                size={50}
                label={user?.name?.charAt(0) || 'U'}
                style={styles.avatar}
              />
              <View style={styles.userDetails}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <View style={styles.tierContainer}>
                  <Text style={styles.tierIcon}>{tier.icon}</Text>
                  <Text style={styles.tierText}>{tier.name} Member</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => {
                // Navigate to notifications
              }}
            >
              <MaterialCommunityIcons name="bell" size={24} color="#FFFFFF" />
              {unreadCount > 0 && (
                <Badge style={styles.notificationBadge}>{unreadCount}</Badge>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Animatable.View animation="fadeInUp" delay={200}>
            <Card style={styles.statsCard}>
              <Card.Content style={styles.statsContent}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.totalGrievances}</Text>
                  <Text style={styles.statLabel}>Total Issues</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.resolvedGrievances}</Text>
                  <Text style={styles.statLabel}>Resolved</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.pendingGrievances}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
              </Card.Content>
            </Card>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={400}>
            <Card style={styles.pointsCard}>
              <Card.Content>
                <View style={styles.pointsHeader}>
                  <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                  <Text style={styles.pointsTitle}>Your Points</Text>
                </View>
                <Text style={styles.pointsNumber}>{stats.totalPoints}</Text>
                <Text style={styles.pointsSubtitle}>
                  {tier.name} Member • {1001 - stats.totalPoints} points to next tier
                </Text>
              </Card.Content>
            </Card>
          </Animatable.View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Animatable.View
                key={action.id}
                animation="fadeInUp"
                delay={600 + index * 100}
              >
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={action.onPress}
                >
                  <Surface style={[styles.quickActionSurface, { backgroundColor: action.color }]}>
                    <MaterialCommunityIcons
                      name={action.icon as any}
                      size={32}
                      color="#FFFFFF"
                    />
                  </Surface>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            <Card.Content>
              <View style={styles.activityItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Grievance Resolved</Text>
                  <Text style={styles.activitySubtitle}>Road repair completed in your area</Text>
                  <Text style={styles.activityTime}>2 hours ago</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <MaterialCommunityIcons name="trophy" size={20} color="#FFD700" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Reward Unlocked</Text>
                  <Text style={styles.activitySubtitle}>You earned 50 points for feedback</Text>
                  <Text style={styles.activityTime}>1 day ago</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <MaterialCommunityIcons name="plus-circle" size={20} color="#2196F3" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>New Grievance</Text>
                  <Text style={styles.activitySubtitle}>Street light issue reported</Text>
                  <Text style={styles.activityTime}>3 days ago</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Report by Category</Text>
          <View style={styles.categoriesGrid}>
            {GRIEVANCE_CATEGORIES.slice(0, 6).map((category, index) => (
              <Animatable.View
                key={category.id}
                animation="fadeInUp"
                delay={800 + index * 100}
              >
                <TouchableOpacity
                  style={styles.categoryCard}
                  onPress={() => navigation.navigate('Submit', { category: category.id })}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Submit')}
        label="Report Issue"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: '#FFFFFF',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    color: '#E8F5E8',
    fontSize: 14,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  tierText: {
    color: '#E8F5E8',
    fontSize: 12,
    fontWeight: '500',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF5722',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  statsCard: {
    marginBottom: 15,
    elevation: 4,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  pointsCard: {
    elevation: 4,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  pointsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  pointsSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    marginBottom: 15,
    alignItems: 'center',
  },
  quickActionSurface: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  recentActivityContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  activityContent: {
    flex: 1,
    marginLeft: 15,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 10,
    color: '#999999',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 3,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});

export default HomeScreen;
