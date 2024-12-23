import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface TableProps {
  headers: string[];
  data: any[];
  onRowPress?: (row: any) => void;
}

const Table: React.FC<TableProps> = ({ headers, data, onRowPress }) => (
  <ScrollView horizontal>
    <View>
      <View style={styles.headerRow}>
        {headers.map((header, index) => (
          <Text key={index} style={styles.headerCell}>{header}</Text>
        ))}
      </View>
      {data.map((row, rowIndex) => (
        <TouchableOpacity key={rowIndex} onPress={() => onRowPress ? onRowPress(row) : null}>
          <View style={styles.row}>
            {Object.values(row).map((cell, cellIndex) => (
              <Text key={cellIndex} style={styles.cell}>{String(cell)}</Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    padding: 8,
    minWidth: 100,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  cell: {
    padding: 8,
    minWidth: 100,
  },
});

export default Table;