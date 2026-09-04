import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface Props {
  children: React.ReactNode;
  duration?: number;
}

// Fades its content in on mount. Give it a `key` that changes with whatever
// you're switching between (e.g. key={screen}) so React remounts it — and
// therefore replays the fade — on every switch, not just the first one.
export function FadeIn({ children, duration = 200 }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }).start();
  }, [opacity, duration]);

  return <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>;
}
