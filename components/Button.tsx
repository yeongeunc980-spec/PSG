import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}) => {
  const buttonStyles = getButtonStyles(variant, size, disabled);
  const textStyles = getTextStyles(variant, size);

  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textStyles.color} size="small" />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const getButtonStyles = (
  variant: string,
  size: string,
  disabled: boolean
): ViewStyle => {
  const baseStyles: ViewStyle = {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  const sizeStyles: Record<string, ViewStyle> = {
    small: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 36 },
    medium: { paddingVertical: 12, paddingHorizontal: 24, minHeight: 44 },
    large: { paddingVertical: 16, paddingHorizontal: 32, minHeight: 56 },
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: '#2563EB',
    },
    secondary: {
      backgroundColor: '#7C3AED',
    },
    danger: {
      backgroundColor: '#DC2626',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#2563EB',
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

const getTextStyles = (variant: string, size: string): TextStyle => {
  const baseStyles: TextStyle = {
    fontWeight: '600',
  };

  const sizeTextStyles: Record<string, TextStyle> = {
    small: { fontSize: 12 },
    medium: { fontSize: 14 },
    large: { fontSize: 16 },
  };

  const variantTextStyles: Record<string, TextStyle> = {
    primary: { color: '#FFFFFF' },
    secondary: { color: '#FFFFFF' },
    danger: { color: '#FFFFFF' },
    outline: { color: '#2563EB' },
  };

  return {
    ...baseStyles,
    ...sizeTextStyles[size],
    ...variantTextStyles[variant],
  };
};
