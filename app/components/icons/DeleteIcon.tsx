import { DimensionValue } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function DeleteIcon(props: {
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
        fillRule="evenodd"
        d="M55 5V0H24V5H5V15H10V71C10 75.9706 14.0294 80 19 80H61C65.9706 80 70 75.9706 70 71V15H75V5H55ZM60 15H20V70H60V15ZM27 60V25H37V60H27ZM43 60V25H53V60H43Z"
        fill={props.color}
      />
    </Svg>
  );
}
