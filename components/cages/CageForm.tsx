import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import Picker from '../common/Picker';
import { Cage } from '../../models/Cage';
import { addCage, updateCage } from '../../services/cageService';

interface CageFormProps {
  cage?: Cage;
  onSave: () => void;
  onCancel: () => void;
}

const CageForm: React.FC<CageFormProps> = ({ cage, onSave, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [enUso, setEnUso] = useState<'S' | 'N'>('N');

  useEffect(() => {
    if (cage) {
      setNombre(cage.nombre);
      setEnUso(cage.enUso);
    }
  }, [cage]);

  const handleSave = async () => {
    const newCage: Cage = {
      id: cage ? cage.id : undefined,
      nombre,
      enUso,
    };

    try {
      if (cage) {
        await updateCage(newCage);
      } else {
        await addCage(newCage);
      }
      onSave();
    } catch (error) {
      console.error('Error saving cage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Input placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <Picker
        selectedValue={enUso}
        onValueChange={(itemValue) => setEnUso(itemValue as 'S' | 'N')}
        items={[
          { label: 'Disponible', value: 'N' },
          { label: 'En Uso', value: 'S' },
        ]}
      />
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

export default CageForm;