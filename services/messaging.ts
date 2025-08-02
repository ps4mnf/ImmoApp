import { supabase } from './supabase';

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  propertyId?: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  receiver?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  property?: {
    id: string;
    title: string;
    images: string[];
  };
};

export async function getMessages(userId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id (
        id,
        full_name,
        avatar_url
      ),
      receiver:receiver_id (
        id,
        full_name,
        avatar_url
      ),
      property:property_id (
        id,
        title,
        images
      )
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(message => ({
    id: message.id,
    senderId: message.sender_id,
    receiverId: message.receiver_id,
    propertyId: message.property_id,
    content: message.content,
    read: message.read,
    createdAt: message.created_at,
    sender: message.sender ? {
      id: message.sender.id,
      fullName: message.sender.full_name || 'Unknown User',
      avatarUrl: message.sender.avatar_url,
    } : undefined,
    receiver: message.receiver ? {
      id: message.receiver.id,
      fullName: message.receiver.full_name || 'Unknown User',
      avatarUrl: message.receiver.avatar_url,
    } : undefined,
    property: message.property ? {
      id: message.property.id,
      title: message.property.title,
      images: message.property.images,
    } : undefined,
  }));
}

export async function getConversations(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id (
        id,
        full_name,
        avatar_url
      ),
      receiver:receiver_id (
        id,
        full_name,
        avatar_url
      ),
      property:property_id (
        id,
        title,
        images
      )
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Group messages by conversation (other user)
  const conversations = new Map();
  
  (data || []).forEach(message => {
    const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
    const otherUser = message.sender_id === userId ? message.receiver : message.sender;
    
    if (!conversations.has(otherUserId)) {
      conversations.set(otherUserId, {
        id: otherUserId,
        user: otherUser,
        lastMessage: message,
        unreadCount: 0,
        property: message.property,
      });
    }
    
    // Count unread messages
    if (message.receiver_id === userId && !message.read) {
      const conversation = conversations.get(otherUserId);
      conversation.unreadCount++;
    }
  });
  
  return Array.from(conversations.values());
}

export async function sendMessage(message: {
  senderId: string;
  receiverId: string;
  propertyId?: string;
  content: string;
}): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: message.senderId,
      receiver_id: message.receiverId,
      property_id: message.propertyId,
      content: message.content,
      read: false,
    })
    .select(`
      *,
      sender:sender_id (
        id,
        full_name,
        avatar_url
      ),
      receiver:receiver_id (
        id,
        full_name,
        avatar_url
      ),
      property:property_id (
        id,
        title,
        images
      )
    `)
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    senderId: data.sender_id,
    receiverId: data.receiver_id,
    propertyId: data.property_id,
    content: data.content,
    read: data.read,
    createdAt: data.created_at,
    sender: data.sender ? {
      id: data.sender.id,
      fullName: data.sender.full_name || 'Unknown User',
      avatarUrl: data.sender.avatar_url,
    } : undefined,
    receiver: data.receiver ? {
      id: data.receiver.id,
      fullName: data.receiver.full_name || 'Unknown User',
      avatarUrl: data.receiver.avatar_url,
    } : undefined,
    property: data.property ? {
      id: data.property.id,
      title: data.property.title,
      images: data.property.images,
    } : undefined,
  };
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);

  if (error) throw error;
}

export async function markConversationAsRead(userId: string, otherUserId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('sender_id', otherUserId)
    .eq('receiver_id', userId);

  if (error) throw error;
}