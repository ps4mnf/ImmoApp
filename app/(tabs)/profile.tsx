import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Heart, MessageSquare, Home, LogOut } from 'lucide-react-native';

const PROFILE_SECTIONS = [
  {
    icon: Heart,
    title: 'Saved Properties',
    subtitle: 'View your favorited properties',
    href: '/favorites',
  },
  {
    icon: MessageSquare,
    title: 'Messages',
    subtitle: 'Chat with agents and owners',
    href: '/messages',
  },
  {
    icon: Home,
    title: 'My Properties',
    subtitle: 'Manage your property listings',
    href: '/agent/listings',
  },
  {
    icon: Settings,
    title: 'Settings',
    subtitle: 'App preferences and account settings',
    href: '/settings',
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg' }}
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>john.doe@example.com</Text>
          </View>
        </View>
        
        <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>
      </View>

      <View style={styles.sections}>
        {PROFILE_SECTIONS.map((section, index) => (
          <Link key={index} href={section.href} asChild>
            <Pressable style={styles.section}>
              <section.icon size={24} color="#1a1a1a" />
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
              </View>
            </Pressable>
          </Link>
        ))}

        <Pressable style={styles.logoutButton}>
          <LogOut size={24} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  sections: {
    padding: 20,
    gap: 16,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f4f4f5',
  },
  sectionContent: {
    marginLeft: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
});