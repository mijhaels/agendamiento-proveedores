import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { Product } from '../../models/Product';
import { addProduct, updateProduct } from '../../services/productService';

interface ProductFormProps {
  product?: Product;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (product) {
      setNombre(product.nombre);
    }
  }, [product]);

  const handleSave = async () => {
    const newProduct: Product = {
      id: product ? product.id : undefined,
      nombre,
    };

    try {
      if (product) {
        await updateProduct(newProduct);
      } else {
        await addProduct(newProduct);
      }
      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
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

export default ProductForm;