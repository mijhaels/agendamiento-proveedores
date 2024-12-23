import React from 'react';
import { StyleSheet } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';

interface PickerProps {
  selectedValue: string | number;
  onValueChange: (itemValue: string | number, itemIndex: number) => void;
  items: { label: string; value: string | number }[];
  style?: any;
}

const Picker: React.FC<PickerProps> = ({ selectedValue, onValueChange, items, style }) => (
  <RNPicker
    style={[styles.picker, style]}
    selectedValue={selectedValue || ''}
    onValueChange={onValueChange}
  >
    <RNPicker.Item label="Seleccione una opción" value="" />
    {items.map((item, index) => (
      <RNPicker.Item 
        key={`${item.value}-${index}`}
        label={item.label} 
        value={item.value || ''}
      />
    ))}
  </RNPicker>
);

const styles = StyleSheet.create({
  picker: {
    borderWidth: 1,
    borderColor: 'gray', 
    borderRadius: 5,
    marginBottom: 10,
    height: 50, // Altura fija para mejor visualización
    backgroundColor: '#fff',
  },
});

export default Picker;