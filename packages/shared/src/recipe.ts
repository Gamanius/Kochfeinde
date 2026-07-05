export const recipeTags = [
    // Meal Type
    "BREAKFAST",
    "BRUNCH",
    "LUNCH",
    "DINNER",
    "SNACK",
    "APPETIZER",
    "SIDE_DISH",
    "DESSERT",
    "DRINK",

    // Cuisine
    "AMERICAN",
    "BRITISH",
    "CHINESE",
    "FRENCH",
    "GREEK",
    "INDIAN",
    "TAMIL",
    "ITALIAN",
    "JAPANESE",
    "KOREAN",
    "MEDITERRANEAN",
    "MEXICAN",
    "MIDDLE_EASTERN",
    "SPANISH",
    "THAI",
    "TURKISH",
    "VIETNAMESE",

    // Diet
    "VEGETARIAN",
    "VEGAN",
    "PESCATARIAN",
    "GLUTEN_FREE",
    "DAIRY_FREE",
    "NUT_FREE",
    "LOW_CARB",
    "KETO",
    "PALEO",
    "HIGH_PROTEIN",
    "LOW_FAT",

    // Difficulty
    "EASY",
    "MEDIUM",
    "HARD",

    // Cooking Method
    "BAKED",
    "ROASTED",
    "GRILLED",
    "FRIED",
    "SAUTEED",
    "BOILED",
    "STEAMED",
    "SLOW_COOKED",
    "PRESSURE_COOKED",
    "AIR_FRIED",
    "SMOKED",
    "RAW",
    "NO_COOK",

    // Occasion
    "WEEKNIGHT",
    "MEAL_PREP",
    "PARTY",
    "HOLIDAY",
    "BBQ",
    "PICNIC",
    "POTLUCK",
    "DATE_NIGHT",
    "GAME_DAY",

    // Style
    "HEALTHY",
    "COMFORT_FOOD",

    // Spice Level
    "MILD",
    "SPICY",
    "VERY_SPICY",
] as const;

export type RecipeTag = (typeof recipeTags)[number];

export interface TagItem {
  value: RecipeTag;
  label: string;
}

export interface TagGroup {
  groupLabel: string;
  tags: TagItem[];
}

/**
 * Groups and German labels for each recipe tag.
 */
export const tagGroups: TagGroup[] = [
  {
    groupLabel: "Mahlzeit",
    tags: [
      { value: "BREAKFAST", label: "Frühstück" },
      { value: "BRUNCH", label: "Brunch" },
      { value: "LUNCH", label: "Mittagessen" },
      { value: "DINNER", label: "Abendessen" },
      { value: "SNACK", label: "Snack" },
      { value: "APPETIZER", label: "Vorspeise" },
      { value: "SIDE_DISH", label: "Beilage" },
      { value: "DESSERT", label: "Nachspeise" },
      { value: "DRINK", label: "Getränk" },
    ],
  },
  {
    groupLabel: "Küche",
    tags: [
      { value: "AMERICAN", label: "Amerikanisch" },
      { value: "BRITISH", label: "Britisch" },
      { value: "CHINESE", label: "Chinesisch" },
      { value: "FRENCH", label: "Französisch" },
      { value: "GREEK", label: "Griechisch" },
      { value: "INDIAN", label: "Indisch" },
      { value: "TAMIL", label: "Tamilisch" },
      { value: "ITALIAN", label: "Italienisch" },
      { value: "JAPANESE", label: "Japanisch" },
      { value: "KOREAN", label: "Koreanisch" },
      { value: "MEDITERRANEAN", label: "Mediterran" },
      { value: "MEXICAN", label: "Mexikanisch" },
      { value: "MIDDLE_EASTERN", label: "Orientalisch" },
      { value: "SPANISH", label: "Spanisch" },
      { value: "THAI", label: "Thailändisch" },
      { value: "TURKISH", label: "Türkisch" },
      { value: "VIETNAMESE", label: "Vietnamesisch" },
    ],
  },
  {
    groupLabel: "Ernährung",
    tags: [
      { value: "VEGETARIAN", label: "Vegetarisch" },
      { value: "VEGAN", label: "Vegan" },
      { value: "PESCATARIAN", label: "Pescetarisch" },
      { value: "GLUTEN_FREE", label: "Glutenfrei" },
      { value: "DAIRY_FREE", label: "Laktosefrei" },
      { value: "NUT_FREE", label: "Nussfrei" },
      { value: "LOW_CARB", label: "Low Carb" },
      { value: "KETO", label: "Keto" },
      { value: "PALEO", label: "Paleo" },
      { value: "HIGH_PROTEIN", label: "Proteinreich" },
      { value: "LOW_FAT", label: "Fettarm" },
    ],
  },
  {
    groupLabel: "Schwierigkeit",
    tags: [
      { value: "EASY", label: "Einfach" },
      { value: "MEDIUM", label: "Mittel" },
      { value: "HARD", label: "Schwer" },
    ],
  },
  {
    groupLabel: "Zubereitung",
    tags: [
      { value: "BAKED", label: "Gebacken" },
      { value: "ROASTED", label: "Geröstet" },
      { value: "GRILLED", label: "Gegrillt" },
      { value: "FRIED", label: "Frittiert" },
      { value: "SAUTEED", label: "Angebraten" },
      { value: "BOILED", label: "Gekocht" },
      { value: "STEAMED", label: "Gedämpft" },
      { value: "SLOW_COOKED", label: "Langgekocht" },
      { value: "PRESSURE_COOKED", label: "Schnellgekocht" },
      { value: "AIR_FRIED", label: "Heißluftfrittiert" },
      { value: "SMOKED", label: "Geräuchert" },
      { value: "RAW", label: "Roh" },
      { value: "NO_COOK", label: "Kein Kochen" },
    ],
  },
  {
    groupLabel: "Anlass",
    tags: [
      { value: "WEEKNIGHT", label: "Alltag" },
      { value: "MEAL_PREP", label: "Meal Prep" },
      { value: "PARTY", label: "Party" },
      { value: "HOLIDAY", label: "Feiertag" },
      { value: "BBQ", label: "Grillen" },
      { value: "PICNIC", label: "Picknick" },
      { value: "POTLUCK", label: "Buffet" },
      { value: "DATE_NIGHT", label: "Date Night" },
      { value: "GAME_DAY", label: "Game Day" },
    ],
  },
  {
    groupLabel: "Stil",
    tags: [
      { value: "HEALTHY", label: "Gesund" },
      { value: "COMFORT_FOOD", label: "Comfort Food" },
    ],
  },
  {
    groupLabel: "Schärfe",
    tags: [
      { value: "MILD", label: "Mild" },
      { value: "SPICY", label: "Scharf" },
      { value: "VERY_SPICY", label: "Sehr scharf" },
    ],
  },
];

/** Lookup from RecipeTag to its German label, derived from tagGroups. */
export const tagLabelMap: Record<RecipeTag, string> = Object.fromEntries(
  tagGroups.flatMap((g) => g.tags.map((t) => [t.value, t.label])),
) as Record<RecipeTag, string>;