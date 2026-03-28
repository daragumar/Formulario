import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, Modal } from 'react-native';
import { clientes as initialData } from '../data/clientes';
import { Cliente } from '../models/Cliente';
import Button from '../components/Button';
import ClienteModal from '../components/ClienteModal';

export default function ClientesScreen() {
  const [clientes, setClientes] = useState<Cliente[]>(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [idEliminar, setIdEliminar] = useState<string | null>(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const animarEntrada = () => {
    scaleAnim.setValue(0.8);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 50 }).start();
  };

  const abrirCrear = () => {
    setClienteEditando(null);
    setModalVisible(true);
    animarEntrada();
  };

  const abrirEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setModalVisible(true);
    animarEntrada();
  };

  const guardarCliente = (data: any) => {
    if (clienteEditando) {
      setClientes(prev => prev.map(c => c.id === clienteEditando.id ? { ...c, ...data } : c));
    } else {
      const nuevo: Cliente = { id: Date.now().toString(), ...data, fecha: new Date() };
      setClientes(prev => [...prev, nuevo]);
    }
    setModalVisible(false);
  };

  const confirmarEliminar = (id: string) => {
    setIdEliminar(id);
    setConfirmVisible(true);
    animarEntrada();
  };

  const ejecutarEliminar = () => {
    setClientes(prev => prev.filter(c => c.id !== idEliminar));
    setConfirmVisible(false);
  };

  const renderItem = ({ item }: { item: Cliente }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.nombre}>{item.nombre} {item.apellido}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={styles.actions}>
        <Button title="Editar" onPress={() => abrirEditar(item)} />
        <Button title="Borrar" variant="danger" onPress={() => confirmarEliminar(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Mis Clientes</Text>
        <Button title="+ Nuevo" onPress={abrirCrear} />
      </View>

      <FlatList
        data={clientes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <ClienteModal
        visible={modalVisible}
        cliente={clienteEditando}
        onClose={() => setModalVisible(false)}
        onSubmit={guardarCliente}
        scaleAnim={scaleAnim}
      />

      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.overlayConfirm}>
          <Animated.View style={[styles.confirmCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.confirmText}>¿Estás seguro de eliminar este cliente?</Text>
            <View style={styles.confirmButtons}>
              <Button title="Cancelar" variant="secondary" onPress={() => setConfirmVisible(false)} />
              <Button title="Eliminar" variant="danger" onPress={ejecutarEliminar} />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f4f7'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16
  },
  email: {
    color: '#666',
    marginTop: 2
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12
  },
  overlayConfirm: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 30
  },
  confirmCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center'
  },
  confirmText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500'
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 15
  }
});