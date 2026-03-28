import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  error?: string;
}

export default function Input({ error, style, ...rest }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        
        placeholderTextColor="#999"
        {...rest} 
        
        style={[
          styles.input, 
          style, 
          error ? styles.inputError : null
        ]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginBottom: 12, 
    width: '100%',
    minHeight: 60, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
    minHeight: 48, 
  },
  inputError: { 
    borderColor: '#e74c3c' 
  },
  errorText: { color: '#e74c3c', 
    fontSize: 12, 
    marginTop: 4 
  },
});