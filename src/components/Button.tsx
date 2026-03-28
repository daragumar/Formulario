import { Pressable, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'secondary';
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}: Props) {
  const variants = {
    primary: '#4a90e2',
    danger: '#e74c3c',
    secondary: '#ccc',
  };

  const backgroundColor = variants[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.5 },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});