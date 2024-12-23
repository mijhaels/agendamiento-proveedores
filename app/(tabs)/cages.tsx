import React from 'react';
import { StyleSheet, View } from 'react-native';
import CageList from '../../components/cages/CageList';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function CagesScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <CageList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});