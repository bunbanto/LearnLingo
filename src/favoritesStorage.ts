const getFavoritesKey = (uid: string) => `learnlingo:favorites:${uid}`;

export const readFavoriteIds = (uid: string) => {
  try {
    const raw = localStorage.getItem(getFavoritesKey(uid));
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];

    if (!Array.isArray(parsed)) return new Set<string>();

    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set<string>();
  }
};

export const writeFavoriteIds = (uid: string, favoriteIds: Set<string>) => {
  localStorage.setItem(
    getFavoritesKey(uid),
    JSON.stringify(Array.from(favoriteIds)),
  );
};
