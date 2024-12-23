import React from 'react';
import { StyleSheet, View } from 'react-native';
import ProviderList from '../../components/providers/ProviderList';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function ProvidersScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ProviderList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});