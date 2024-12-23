import React from 'react';
import { StyleSheet, View } from 'react-native';
import ProductList from '../../components/products/ProductList';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function ProductsScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ProductList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});