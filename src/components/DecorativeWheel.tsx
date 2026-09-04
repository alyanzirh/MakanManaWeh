import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, componentTokens } from '../theme/theme';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface Props {
  segmentCount: 4 | 6 | 8;
  spinning: boolean;
  size?: number;
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

// The small decorative wheel shown on Spin (animating) and Result (static)
// — purely atmospheric, not slice-per-restaurant like a classic prize wheel.
// A conic-gradient in the source; react-native-svg has no conic gradient,
// so it's built from wedge <Path> arcs instead.
export function DecorativeWheel({ segmentCount, spinning, size = componentTokens.wheel.diameterCompact }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!spinning) {
      rotation.stopAnimation();
      rotation.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(rotation, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [spinning, rotation]);

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const radius = size / 2;
  const sliceAngle = 360 / segmentCount;
  const colorCycle = componentTokens.wheel.colorCycle;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.pointer} />
      <View style={styles.shadowWrap}>
        <AnimatedSvg width={size} height={size} style={{ transform: [{ rotate: spin }] }}>
          {Array.from({ length: segmentCount }).map((_, index) => (
            <Path
              key={index}
              d={slicePath(radius, radius, radius - 1.5, sliceAngle * index, sliceAngle * (index + 1))}
              fill={colorCycle[index % colorCycle.length]}
            />
          ))}
          <Circle cx={radius} cy={radius} r={radius - 1.5} fill="none" stroke={colors.white} strokeWidth={3} />
        </AnimatedSvg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'flex-start' },
  pointer: {
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
    zIndex: 2,
  },
  shadowWrap: {
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 0,
    elevation: 1,
  },
});
