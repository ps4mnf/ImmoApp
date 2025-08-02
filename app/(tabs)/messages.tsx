import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, MessageSquare } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { getConversations } from '@/services/messaging';


export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getConversations(user.id);
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <ScrollView style={styles.messagesList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading conversations...</Text>
          </View>
        ) : conversations.map((conversation) => (
          <Pressable key={conversation.id} style={styles.messageItem}>
            <Image 
              source={{ 
                uri: conversation.user?.avatar_url || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
              }} 
              style={styles.avatar} 
            />
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.name}>
                  {conversation.user?.full_name || 'Unknown User'}
                </Text>
                <Text style={styles.time}>
                  {formatTime(conversation.lastMessage.created_at)}
                </Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {conversation.lastMessage.content}
              </Text>
            </View>
            {conversation.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {!loading && conversations.length === 0 && (
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
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
    padding: 24,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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