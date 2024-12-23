import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import Button from '../common/Button';
import Input from '../common/Input';
import { Product } from '../../models/Product';
import { getProducts, deleteProduct } from '../../services/productService';
import ProductForm from './ProductForm';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts(filter);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    loadProducts();
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Button title="Editar" onPress={() => handleEdit(item)} style={styles.button} />
      <Button title="Eliminar" onPress={() => handleDelete(item.id!)} style={[styles.button, { backgroundColor: 'red' }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Input placeholder="Filtrar por nombre" value={filter} onChangeText={setFilter} />
      <Button title="Buscar" onPress={loadProducts} />
      <Button title="Agregar Producto" onPress={handleAdd} />

      {showForm && (
        <ProductForm product={selectedProduct || undefined} onSave={handleSave} onCancel={handleCancel} />
      )}

      <FlatList data={products} keyExtractor={(item) => item.id!.toString()} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
  },
  button: {
    marginLeft: 10,
  },
});

export default ProductList;