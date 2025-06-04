import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image } from 'react-native';
import { Search, MessageSquare } from 'lucide-react-native';

const SAMPLE_MESSAGES = [
  {
    id: '1',
    name: 'Sarah Wilson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    lastMessage: 'Is the property still available?',
    time: '2m ago',
    unread: 2,
  },
  {
    id: '2',
    name: 'Michael Brown',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    lastMessage: 'When can I schedule a viewing?',
    time: '1h ago',
    unread: 0,
  },
];

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Chat with property owners and agents</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Search messages"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.messagesList}>
        {SAMPLE_MESSAGES.map((message) => (
          <Pressable key={message.id} style={styles.messageItem}>
            <Image source={{ uri: message.avatar }} style={styles.avatar} />
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.name}>{message.name}</Text>
                <Text style={styles.time}>{message.time}</Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {message.lastMessage}
              </Text>
            </View>
            {message.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{message.unread}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {SAMPLE_MESSAGES.length === 0 && (
        <View style={styles.emptyState}>
          <MessageSquare size={48} color="#666" />
          <Text style={styles.emptyStateTitle}>No Messages Yet</Text>
          <Text style={styles.emptyStateSubtitle}>
            Start conversations with property owners and agents
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    padding: 20,
    paddingTop: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  messagesList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  time: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});