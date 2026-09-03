import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { CUISINE_OPTIONS } from '../constants/cuisines';
import { CuisineId, Filters } from '../types';

interface Props {
  visible: boolean;
  filters: Filters;
  onChangeFilters: (filters: Filters) => void;
  onToggleCuisine: (id: CuisineId) => void;
  onClose: () => void;
}

export function FilterSheet({ visible, filters, onChangeFilters, onToggleCuisine, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <Text style={styles.title}>Filters</Text>

        <Text style={styles.label}>Search radius: {filters.radiusKm.toFixed(1)} km</Text>
        <Slider
          minimumValue={0.5}
          maximumValue={15}
          step={0.5}
          value={filters.radiusKm}
          onValueChange={(radiusKm) => onChangeFilters({ ...filters, radiusKm })}
        />

        <Text style={styles.label}>Restaurants on the wheel: {filters.maxRestaurants}</Text>
        <Slider
          minimumValue={3}
          maximumValue={15}
          step={1}
          value={filters.maxRestaurants}
          onValueChange={(maxRestaurants) => onChangeFilters({ ...filters, maxRestaurants })}
        />

        <Text style={styles.label}>Cuisine</Text>
        <ScrollView style={{ flex: 1 }}>
          {CUISINE_OPTIONS.map((option) => {
            const selected = filters.cuisines.includes(option.id);
            return (
              <Pressable
                key={option.id}
                onPress={() => onToggleCuisine(option.id)}
                style={[styles.row, selected && styles.rowSelected]}
              >
                <Text style={styles.rowText}>
                  {option.icon} {option.label}
                </Text>
                {selected && <Text style={styles.check}>✓</Text>}
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable style={styles.doneButton} onPress={onClose}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 15, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  rowSelected: { backgroundColor: '#EFF6FF' },
  rowText: { fontSize: 16 },
  check: { fontSize: 16, color: '#3B82F6', fontWeight: '700' },
  doneButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  doneText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
