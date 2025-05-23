import { DimensionValue } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function DefinitionIcon(props: {
  size: DimensionValue;
  color: string;
}) {
  return (
    <Svg
      viewBox="0 0 80 80"
      fill="none"
      style={{ width: props.size, height: props.size }}
    >
      <Path d="M20 41H51V31H20V41Z" fill={props.color} />
      <Path d="M20 57H51V47H20V57Z" fill={props.color} />
      <Path
        fillRule="evenodd"
        d="M10 2C8 3.5 6 6 6.00037 11V67.9994C6.00037 74.5 9.81965 77.5 11.7639 78.4721C13.7082 79.4443 16.0004 80 20 80H65V73H77V0L20 9.53674e-07C14 0 12 0.5 10 2ZM67 10L20 10C18 10 16.0004 10 16.0004 11C16.0004 12 18 12 20 12H65V63H67V10ZM16.0004 68C16 68.5 16 69 16.5 69.5C17 70 18 70 20 70H55V22H16.0004V68Z"
        fill={props.color}
      />
    </Svg>
  );
}
