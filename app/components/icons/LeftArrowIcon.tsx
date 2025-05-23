import { DimensionValue } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function LeftArrowIcon(props: {
  size: DimensionValue;
  color: string;
}) {
  return (
    <Svg
      viewBox="0 0 80 80"
      fill="none"
      style={{ width: props.size, height: props.size }}
    >
      <Path
        d="M53.4645 5.46446L60.5356 12.5355L33.0711 40L60.5356 67.4645L53.4645 74.5355L18.929 40L53.4645 5.46446Z"
        fill={props.color}
      />
    </Svg>
  );
}
