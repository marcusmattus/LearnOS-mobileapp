/** Every screen in the LearnOS flow, in the order the prototype walks them. */
export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  Capture: undefined;
  Review: undefined;
  Analysing: undefined;
  Complete: undefined;
  Concepts: undefined;
  ProfileMatch: undefined;
  Building: undefined;
  Map: undefined;
  Lesson: undefined;
  Another: undefined;
  Practice: undefined;
  Teachback: undefined;
  Adapt: undefined;
  Mastery: undefined;
  Progress: undefined;
  Profile: undefined;
  Library: undefined;
};

export type ScreenName = keyof RootStackParamList;

/** The screens that show the tab bar. */
export const NAV_SCREENS: ScreenName[] = ['Home', 'Scan', 'Map', 'Progress', 'Profile', 'Library'];
