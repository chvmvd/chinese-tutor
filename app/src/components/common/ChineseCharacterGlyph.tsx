import { StyleProp, ViewStyle } from "react-native";
import { G, Path, Svg } from "react-native-svg";
import makeMeAHanzi from "../../data/makeMeAHanzi";

export default function ChineseCharacterGlyph(props: {
  character: string;
  characterStyle?: StyleProp<ViewStyle>;
}) {
  const character = makeMeAHanzi.find(
    (entry) => entry.character === props.character,
  );

  if (character === undefined) {
    return null;
  }

  return (
    <Svg viewBox="0 0 1024 1024" style={props.characterStyle}>
      <G transform="scale(1, -1) translate(0, -900)">
        {character.strokes.map((stroke, index) => (
          <Path key={`${character}_${index}`} d={stroke} />
        ))}
      </G>
    </Svg>
  );
}
