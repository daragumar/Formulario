import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' }
  });
  const { login } = useAuth();
  const [errorGeneral, setErrorGeneral] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setErrorGeneral('');
    setLoading(true);
    const success = await login(data.email, data.password);
    setLoading(false);
    if (!success) setErrorGeneral('Credenciales incorrectas');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          <Controller
            control={control}
            name="email"
            rules={{ 
              required: 'El email es obligatorio',
              pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, message: 'Email inválido' }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="correo@ejemplo.com"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ 
              required: 'La contraseña es obligatoria',
              minLength: { value: 4, message: 'Mínimo 4 caracteres' }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="********"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          {errorGeneral ? <Text style={styles.errorMsg}>{errorGeneral}</Text> : null}

          <Button 
            title={loading ? "Cargando..." : "Ingresar"} 
            onPress={handleSubmit(onSubmit)} 
            disabled={loading} 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#f2f4f7' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 12, 
    elevation: 5 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 5 
  },
  subtitle: { 
    textAlign: 'center', 
    color: '#666', 
    marginBottom: 20 
  },
  errorMsg: { color: '#e74c3c', 
    textAlign: 'center', 
    marginBottom: 10, 
    fontSize: 14 
  }
});