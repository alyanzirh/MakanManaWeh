import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Mascot } from '../components/Mascot';
import { CUISINE_OPTIONS } from '../constants/cuisines';
import { CuisineId, Filters, WheelSize } from '../types';
import { colors, componentTokens } from '../theme/theme';

interface Props {
  filters: Filters;
  onChangeFilters: (filters: Filters) => void;
  onSubmit: () => void;
}

const WHEEL_SIZES: WheelSize[] = ['few', 'some', 'lots'];

export function SetupScreen({ filters, onChangeFilters, onSubmit }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Mascot variant="setupIcon" size={44} />
        <Text style={styles.heading}>okay, tell us more!</Text>
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.label}>how far can we go?</Text>
        <Text style={styles.radiusValue}>{filters.radiusKm} km</Text>
      </View>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={filters.radiusKm}
        onValueChange={(radiusKm) => onChangeFilters({ ...filters, radiusKm })}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.sand}
        thumbTintColor={colors.primary}
        style={styles.slider}
      />
      <View style={styles.captionRow}>
        <Text style={styles.captionText}>1 km</Text>
        <Text style={styles.captionText}>10 km</Text>
      </View>

      <Text style={styles.label}>what are you craving?</Text>
      <View style={styles.chipRow}>
        {CUISINE_OPTIONS.map((option) => {
          const selected = filters.cuisine === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onChangeFilters({ ...filters, cuisine: option.id as CuisineId })}
              style={[styles.chip, { backgroundColor: selected ? componentTokens.chip.bgSelected : componentTokens.chip.bgUnselected }]}
            >
              <Text style={[styles.chipText, { color: selected ? componentTokens.chip.textSelected : colors.bodyTextOnCream }]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>how many options?</Text>
      <View style={styles.segmentTrack}>
        {WHEEL_SIZES.map((size) => {
          const selected = filters.wheelSize === size;
          return (
            <Pressable
              key={size}
              onPress={() => onChangeFilters({ ...filters, wheelSize: size })}
              style={[styles.segment, { backgroundColor: selected ? colors.primary : 'transparent' }]}
            >
              <Text style={[styles.segmentText, { color: selected ? colors.white : colors.bodyTextOnCream }]}>{size}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.sizeCaptionRow}>
        {WHEEL_SIZES.map((size) => (
          <Text key={size} style={styles.segmentCaption}>
            max {componentTokens.sizeCaps[size]}
          </Text>
        ))}
      </View>

      <Pressable style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitText}>find restaurants</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  heading: { fontFamily: 'Fredoka_700Bold', fontSize: 15, color: colors.primary },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  label: { fontFamily: 'Quicksand_700Bold', fontSize: 12, color: colors.bodyTextOnCream, marginBottom: 8 },
  radiusValue: { fontFamily: 'Fredoka_700Bold', fontSize: 13, color: colors.primary },
  slider: { width: '100%', marginBottom: 4 },
  captionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  captionText: { fontFamily: 'Quicksand_500Medium', fontSize: 9, color: colors.sliderCaption },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  chip: { borderRadius: componentTokens.chip.radius, paddingVertical: 8, paddingHorizontal: 14 },
  chipText: { fontFamily: 'Quicksand_700Bold', fontSize: 12 },
  segmentTrack: { flexDirection: 'row', gap: 6, backgroundColor: colors.sand, borderRadius: 14, padding: 4, marginBottom: 6 },
  segment: { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 11 },
  segmentText: { fontFamily: 'Quicksand_700Bold', fontSize: 11 },
  sizeCaptionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 18 },
  segmentCaption: { fontFamily: 'Quicksand_500Medium', fontSize: 9, color: colors.segmentCaption },
  submitButton: { backgroundColor: colors.primary, borderRadius: 99, paddingVertical: 13, alignItems: 'center' },
  submitText: { fontFamily: 'Quicksand_700Bold', color: colors.white, fontSize: 14 },
});
