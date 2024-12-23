import React from 'react';
import { StyleSheet, View } from 'react-native';
import ReceptionList from '../../components/receptions/ReceptionList';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function ReceptionsScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ReceptionList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});