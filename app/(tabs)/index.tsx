import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        ¡Bienvenido al Sistema de Agendamiento de Proveedores!
      </Text>
      <Text style={{ color: textColor }}>
        Selecciona una opción del menú para comenzar.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});