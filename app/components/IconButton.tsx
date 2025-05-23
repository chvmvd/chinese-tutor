import Touchable from "./Touchable";

export default function IconButton(props: {
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Touchable
      onPress={props.onPress}
      style={{
        borderRadius: 100,
        padding: 8,
      }}
      hoveredStyle={{
        backgroundColor: "#ECECEC",
      }}
      pressedStyle={{
        backgroundColor: "#DDDDDD",
      }}
    >
      {props.children}
    </Touchable>
  );
}
