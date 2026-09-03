import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { Restaurant } from '../types';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E', '#14B8A6',
  '#06B6D4', '#3B82F6', '#6366F1', '#A855F7', '#EC4899', '#78716C',
];

interface Props {
  restaurants: Restaurant[];
  rotation: Animated.Value;
  size: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function slicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function Wheel({ restaurants, rotation, size }: Props) {
  const radius = size / 2;
  const sliceAngle = 360 / Math.max(restaurants.length, 1);

  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ width: size, alignItems: 'center' }}>
      <View style={styles.pointer} />
      <AnimatedSvg width={size} height={size} style={{ transform: [{ rotate: spin }] }}>
        {restaurants.map((restaurant, index) => {
          const startAngle = sliceAngle * index;
          const endAngle = sliceAngle * (index + 1);
          const midAngle = startAngle + sliceAngle / 2;
          const labelPos = polarToCartesian(radius, radius, radius * 0.62, midAngle);
          const label =
            restaurant.name.length > 16 ? `${restaurant.name.slice(0, 14)}…` : restaurant.name;

          return (
            <React.Fragment key={restaurant.id}>
              <Path
                d={slicePath(radius, radius, radius, startAngle, endAngle)}
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth={1}
              />
              <SvgText
                x={labelPos.x}
                y={labelPos.y}
                fill="white"
                fontSize={size * 0.032}
                fontWeight="bold"
                textAnchor="middle"
                rotation={midAngle}
                origin={`${labelPos.x}, ${labelPos.y}`}
              >
                {label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </AnimatedSvg>
    </View>
  );
}

const styles = StyleSheet.create({
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1F2937',
    marginBottom: -4,
    zIndex: 2,
  },
});
