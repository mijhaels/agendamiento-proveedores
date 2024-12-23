import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: any;
  keyboardType?: any;
  editable?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  style, 
  keyboardType,
  editable = true
}) => (
  <TextInput
    style={[styles.input, style]}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
    editable={editable}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default Input;