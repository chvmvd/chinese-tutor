import { StyleProp, View, ViewStyle } from "react-native";
import { G, Path, Svg } from "react-native-svg";
import makeMeAHanzi from "../../data/makeMeAHanzi";

export default function ChineseCharacterStrokeOrderDisplay(props: {
  character: string;
  characterStyle: StyleProp<ViewStyle>;
}) {
  const character = makeMeAHanzi.find(
    (entry) => entry.character === props.character,
  );

  if (character === undefined) {
    return null;
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {character.strokes.map((_, displayStrokeIndex) => (
        <Svg
          key={`${character}_${displayStrokeIndex}`}
          viewBox="0 0 1024 1024"
          style={props.characterStyle}
        >
          <G transform="scale(1, -1) translate(0, -900)">
            {character.strokes.map((stroke, strokeIndex) => (
              <Path
                key={strokeIndex}
                d={stroke}
                fill={
                  strokeIndex < displayStrokeIndex
                    ? "black"
                    : strokeIndex === displayStrokeIndex
                      ? "red"
                      : "gray"
                }
              />
            ))}
          </G>
        </Svg>
      ))}
    </View>
  );
}
