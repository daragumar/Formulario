import {  View,  Text,  TouchableOpacity,  StyleSheet,} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Tipado navegación
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Panel de Control</Text>
        <Text style={styles.email}>Conectado como: {user?.email}</Text>
      </View>

      {/* OPCIONES */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Clientes')}
        >
          <Text style={styles.cardTitle}>Clientes</Text>
          <Text style={styles.cardSubtitle}>
            Administra, edita y elimina tu base de datos de clientes.
          </Text>
        </TouchableOpacity>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f4f7',
  },
  header: {
    marginBottom: 30,
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
    marginTop: 5,
  },
  cardsContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#666',
    marginTop: 5,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e74c3c',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});