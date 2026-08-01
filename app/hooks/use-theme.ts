import { Theme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function useTheme() {
  const theme = useColorScheme() ?? "light";

  return { colors: Theme.colors[theme], fonts: Theme.fonts };
}
