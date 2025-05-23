import { useState } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

export default function Touchable(props: {
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  hoveredStyle: StyleProp<ViewStyle>;
  pressedStyle: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={props.onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        props.style,
        isPressed ? props.pressedStyle : isHovered ? props.hoveredStyle : {},
      ]}
    >
      {props.children}
    </Pressable>
  );
}
