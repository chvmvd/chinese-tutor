import { DimensionValue } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function EditIcon(props: {
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
        d="M59.7574 2.17157C62.1005 -0.171567 65.8995 -0.171576 68.2426 2.17157L77.8284 11.7574C80.1716 14.1005 80.1716 17.8995 77.8284 20.2426L19.8284 78.2426C18.7032 79.3679 17.1771 80 15.5858 80H6C2.68629 80 0 77.3137 0 74V64.4142C0 62.8229 0.632141 61.2968 1.75736 60.1716L59.7574 2.17157ZM64 12.0711L59.5711 16.5L63.5 20.4289L67.9289 16L64 12.0711ZM56.4289 27.5L52.5 23.5711L10 66.0711V70H13.9289L56.4289 27.5Z"
        fill={props.color}
      />
    </Svg>
  );
}
