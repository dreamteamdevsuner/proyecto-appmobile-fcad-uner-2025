import { useDropdownTheme } from "./useDropdownTheme";

export const useDropdownThemedProps = () => {
  const t = useDropdownTheme();

  return {
    style: t.style,
    dropDownContainerStyle: t.dropDownContainerStyle,
    textStyle: t.textStyle,
    placeholderStyle: t.placeholderStyle,
    badgeStyle: t.badgeStyle,
    badgeTextStyle: t.badgeTextStyle,
    arrowIconStyle: t.arrowIconStyle,
    tickIconStyle: t.tickIconStyle,
  } as const;
};
