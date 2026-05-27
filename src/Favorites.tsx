import { useEffect, useMemo, useState } from "react";
import { readFavoriteIds, writeFavoriteIds } from "./favoritesStorage";
import { TeacherCard } from "./TeacherCard";
import { teachersData } from "./teachersData";
import type { Teacher, TeacherFilters } from "./types";
import { useAuth } from "./useAuth";

const emptyFilters: TeacherFilters = {
  language: "",
  level: "",
  price: "",
};

const filterTeachers = (teachers: Teacher[], filters: TeacherFilters) =>
  teachers.filter((teacher) => {
    const byLanguage =
      !filters.language || teacher.languages.includes(filters.language);
    const byLevel = !filters.level || teacher.levels.includes(filters.level);
    const byPrice =
      !filters.price || teacher.price_per_hour === Number(filters.price);

    return byLanguage && byLevel && byPrice;
  });

export const Favorites = () => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filters, setFilters] = useState<TeacherFilters>(emptyFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      await Promise.resolve();

      if (!user?.uid) {
        setFavoriteIds(new Set());
        setTeachers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setFavoriteIds(readFavoriteIds(user.uid));
      setLoading(false);
    };

    void run();
  }, [user?.uid]);

  const toggleFavorite = async (teacherId: string) => {
    if (!user?.uid) return;

    const currentlyFavorite = favoriteIds.has(teacherId);
    const next = new Set(favoriteIds);

    if (currentlyFavorite) next.delete(teacherId);
    else next.add(teacherId);

    setFavoriteIds(next);
    writeFavoriteIds(user.uid, next);
  };

  useEffect(() => {
    const run = async () => {
      if (!user?.uid) return;

      if (favoriteIds.size === 0) {
        setTeachers([]);
        return;
      }

      try {
        const list = teachersData.filter((teacher) =>
          favoriteIds.has(teacher.id),
        );
        setTeachers(list);
      } catch (e) {
        console.error("Error loading favorite teachers:", e);
        setTeachers([]);
      }
    };

    void run();
  }, [favoriteIds, user?.uid]);

  const languages = useMemo(
    () => [...new Set(teachers.flatMap((teacher) => teacher.languages))].sort(),
    [teachers],
  );
  const levels = useMemo(
    () => [...new Set(teachers.flatMap((teacher) => teacher.levels))],
    [teachers],
  );
  const prices = useMemo(
    () =>
      [...new Set(teachers.map((teacher) => teacher.price_per_hour))].sort(
        (a, b) => a - b,
      ),
    [teachers],
  );
  const filteredTeachers = useMemo(
    () => filterTeachers(teachers, filters),
    [teachers, filters],
  );

  const updateFilter = (name: keyof TeacherFilters, value: string) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  if (loading) {
    return <div className="teachers-page">Loading favorites...</div>;
  }

  return (
    <section className="teachers-page">
      {teachers.length > 0 && (
        <form className="filters" aria-label="Favorite teacher filters">
          <label>
            Languages
            <select
              value={filters.language}
              onChange={(event) => updateFilter("language", event.target.value)}
            >
              <option value="">All languages</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>

          <label>
            Level of knowledge
            <select
              value={filters.level}
              onChange={(event) => updateFilter("level", event.target.value)}
            >
              <option value="">All levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label>
            Price
            <select
              value={filters.price}
              onChange={(event) => updateFilter("price", event.target.value)}
            >
              <option value="">Any price</option>
              {prices.map((price) => (
                <option key={price} value={price}>
                  {price}$
                </option>
              ))}
            </select>
          </label>
        </form>
      )}

      <ul className="teachers-list">
        {filteredTeachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            isFavorite={favoriteIds.has(teacher.id)}
            selectedLevel={filters.level}
            onToggleFavorite={() => toggleFavorite(teacher.id)}
          />
        ))}
      </ul>

      {teachers.length === 0 && (
        <p className="empty-state">Favorites list is empty.</p>
      )}
      {teachers.length > 0 && filteredTeachers.length === 0 && (
        <p className="empty-state">No favorite teachers found.</p>
      )}
    </section>
  );
};
