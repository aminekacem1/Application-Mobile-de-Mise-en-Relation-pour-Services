import React from 'react';
import { Text } from 'react-native';

export default function ThemedText({ style, children, ...props }) {
  return (
    <Text style={style} {...props}>
      {children}
    </Text>
  );
}
