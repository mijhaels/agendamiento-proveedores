import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { Provider } from '../../models/Provider';
import { addProvider, updateProvider } from '../../services/providerService';

interface ProviderFormProps {
  provider?: Provider;
  onSave: () => void;
  onCancel: () => void;
}

const ProviderForm: React.FC<ProviderFormProps> = ({ provider, onSave, onCancel }) => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (provider) {
      setNombre(provider.nombre);
    }
  }, [provider]);

  const handleSave = async () => {
    const newProvider: Provider = {
      id: provider ? provider.id : undefined,
      nombre,
    };

    try {
      if (provider) {
        await updateProvider(newProvider);
      } else {
        await addProvider(newProvider);
      }
      onSave();
    } catch (error) {
      console.error('Error saving provider:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Input placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <Button title="Guardar" onPress={handleSave} />
      <Button title="Cancelar" onPress={onCancel} style={{ backgroundColor: 'red' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default ProviderForm;