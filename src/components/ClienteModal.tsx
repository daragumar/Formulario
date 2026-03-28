import React from 'react';
import { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Input from './Input';
import Button from './Button';
import { Cliente } from '../models/Cliente';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    cliente: Cliente | null;
    scaleAnim: Animated.Value;
}

export default function ClienteModal({ visible, onClose, onSubmit, cliente, scaleAnim }: Props) {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { nombre: '', apellido: '', email: '' }
    });



    useEffect(() => {
        if (cliente) {
            reset(cliente);
        } else {
            reset({ nombre: '', apellido: '', email: '' });
        }
    }, [cliente]);


    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* Fondo para cerrar teclado */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <Animated.View style={[styles.modalCard, { transform: [{ scale: scaleAnim }] }]}>
                        <Text style={styles.title}>{cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</Text>

                        <ScrollView
                            bounces={false}
                            keyboardShouldPersistTaps="always" 
                        >
                            <Controller
                                control={control}
                                name="nombre"
                                rules={{ required: 'El nombre es requerido' }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        placeholder="Nombre"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.nombre?.message}
                                        autoCapitalize="words"
                                        importantForAutofill="yes"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="apellido"
                                rules={{ required: 'El apellido es requerido' }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        placeholder="Apellido"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.apellido?.message}
                                        autoCapitalize="words"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required: 'El email es requerido',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                                        message: 'Email inválido (ej: usuario@dominio.com)'
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        placeholder="Email"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.email?.message}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                )}
                            />

                            <View style={styles.buttonGap}>
                                <Button title="Guardar" onPress={handleSubmit(onSubmit)} />
                                <Button title="Cancelar" variant="secondary" onPress={onClose} />
                            </View>
                        </ScrollView>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
    },
    keyboardView: {
        justifyContent: 'center'
    },
    modalCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        elevation: 5,
        maxHeight: '90%'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    buttonGap: {
        gap: 10,
        marginTop: 10
    }
});