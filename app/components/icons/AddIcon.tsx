import { DimensionValue } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function AddIcon(props: {
  size: DimensionValue;
  color: string;
}) {
  return (
    <Svg
      viewBox="0 0 80 80"
      fill="none"
      style={{ width: props.size, height: props.size }}
    >
      <Path d="M35 35V0H45V35H80V45H45V80H35V45H0V35H35Z" fill={props.color} />
    </Svg>
  );
}
