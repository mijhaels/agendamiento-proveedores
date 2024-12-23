import React from 'react';
import { StyleSheet, View } from 'react-native';
import ReservationList from '../../components/reservations/ReservationList';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function ReservationsScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ReservationList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});