import { View, Text, StyleSheet } from 'react-native';
import { Crown } from 'lucide-react-native';

export default function PremiumBadge() {
  return (
    <View style={styles.container}>
      <Crown size={14} color="#fff" />
      <Text style={styles.text}>Premium</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});