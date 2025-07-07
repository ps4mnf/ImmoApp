import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingUp, Eye, Heart, MessageSquare, Users, Calendar } from 'lucide-react-native';

const ANALYTICS_DATA = [
  {
    title: 'Total Views',
    value: '1,234',
    change: '+15%',
    changeType: 'positive' as const,
    icon: Eye,
    color: '#2563eb',
  },
  {
    title: 'Property Favorites',
    value: '89',
    change: '+8%',
    changeType: 'positive' as const,
    icon: Heart,
    color: '#ef4444',
  },
  {
    title: 'Inquiries',
    value: '23',
    change: '+12%',
    changeType: 'positive' as const,
    icon: MessageSquare,
    color: '#10b981',
  },
  {
    title: 'Profile Views',
    value: '456',
    change: '+5%',
    changeType: 'positive' as const,
    icon: Users,
    color: '#f59e0b',
  },
];

const MONTHLY_STATS = [
  { month: 'Jan', views: 120, inquiries: 8 },
  { month: 'Feb', views: 150, inquiries: 12 },
  { month: 'Mar', views: 180, inquiries: 15 },
  { month: 'Apr', views: 220, inquiries: 18 },
  { month: 'May', views: 280, inquiries: 23 },
  { month: 'Jun', views: 320, inquiries: 28 },
];

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your property performance</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {ANALYTICS_DATA.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: `${metric.color}20` }]}>
                <metric.icon size={24} color={metric.color} />
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricTitle}>{metric.title}</Text>
              <Text style={[
                styles.metricChange,
                metric.changeType === 'positive' ? styles.positiveChange : styles.negativeChange
              ]}>
                {metric.change} this month
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Monthly Trends */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Trends</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#2563eb' }]} />
                <Text style={styles.legendText}>Views</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
                <Text style={styles.legendText}>Inquiries</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.chart}>
            {MONTHLY_STATS.map((stat, index) => (
              <View key={index} style={styles.chartColumn}>
                <View style={styles.chartBars}>
                  <View 
                    style={[
                      styles.chartBar,
                      { 
                        height: (stat.views / 320) * 100,
                        backgroundColor: '#2563eb'
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.chartBar,
                      { 
                        height: (stat.inquiries / 28) * 100,
                        backgroundColor: '#10b981'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.chartLabel}>{stat.month}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Performance Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Insights</Text>
        <View style={styles.insightsContainer}>
          <View style={styles.insightCard}>
            <TrendingUp size={24} color="#10b981" />
            <Text style={styles.insightTitle}>Growing Interest</Text>
            <Text style={styles.insightText}>
              Your properties are getting 15% more views this month compared to last month.
            </Text>
          </View>
          
          <View style={styles.insightCard}>
            <Calendar size={24} color="#f59e0b" />
            <Text style={styles.insightTitle}>Best Performing Day</Text>
            <Text style={styles.insightText}>
              Sundays generate the most property views and inquiries.
            </Text>
          </View>
          
          <View style={styles.insightCard}>
            <MessageSquare size={24} color="#2563eb" />
            <Text style={styles.insightTitle}>Response Rate</Text>
            <Text style={styles.insightText}>
              You respond to inquiries 2x faster than average agents.
            </Text>
          </View>
        </View>
      </View>

      {/* Top Performing Properties */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Performing Properties</Text>
        <View style={styles.topPropertiesContainer}>
          <View style={styles.topPropertyCard}>
            <Text style={styles.topPropertyRank}>#1</Text>
            <View style={styles.topPropertyInfo}>
              <Text style={styles.topPropertyTitle}>Luxury Villa with Ocean View</Text>
              <Text style={styles.topPropertyStats}>234 views • 12 favorites</Text>
            </View>
            <Text style={styles.topPropertyChange}>+25%</Text>
          </View>
          
          <View style={styles.topPropertyCard}>
            <Text style={styles.topPropertyRank}>#2</Text>
            <View style={styles.topPropertyInfo}>
              <Text style={styles.topPropertyTitle}>Modern Downtown Apartment</Text>
              <Text style={styles.topPropertyStats}>189 views • 8 favorites</Text>
            </View>
            <Text style={styles.topPropertyChange}>+18%</Text>
          </View>
          
          <View style={styles.topPropertyCard}>
            <Text style={styles.topPropertyRank}>#3</Text>
            <View style={styles.topPropertyInfo}>
              <Text style={styles.topPropertyTitle}>Cozy Suburban Home</Text>
              <Text style={styles.topPropertyStats}>156 views • 6 favorites</Text>
            </View>
            <Text style={styles.topPropertyChange}>+12%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  metricTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  metricChange: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  positiveChange: {
    color: '#10b981',
  },
  negativeChange: {
    color: '#ef4444',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 2,
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 8,
  },
  insightsContainer: {
    gap: 16,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  topPropertiesContainer: {
    gap: 12,
  },
  topPropertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  topPropertyRank: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2563eb',
    width: 30,
  },
  topPropertyInfo: {
    flex: 1,
  },
  topPropertyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  topPropertyStats: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  topPropertyChange: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10b981',
  },
});