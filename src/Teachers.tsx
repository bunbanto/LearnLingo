import { useCallback, useEffect, useMemo, useState } from "react";
import { readFavoriteIds, writeFavoriteIds } from "./favoritesStorage";
import { TeacherCard } from "./TeacherCard";
import { teachersData } from "./teachersData";
import type { Teacher, TeacherFilters } from "./types";
import { useAuth } from "./useAuth";

const pageSize = 4;

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

export const Teachers = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<TeacherFilters>(emptyFilters);
  const [notice, setNotice] = useState("");

  const uid = user?.uid;

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.resolve();
      setTeachers(teachersData);
    } catch (error) {
      console.error("Error loading teachers:", error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        await Promise.resolve();
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error loading teachers:", error);
        setTeachers([]);
      }
    };

    void run();
  }, []);

  useEffect(() => {
    const run = async () => {
      await Promise.resolve();

      if (!uid) {
        setFavoriteIds(new Set());
        return;
      }

      setFavoriteIds(readFavoriteIds(uid));
    };

    void run();
  }, [uid]);

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
  const visibleTeachers = filteredTeachers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTeachers.length;

  const toggleFavorite = useCallback(
    async (teacherId: string) => {
      if (!uid) {
        setNotice("This feature is available only for authorized users.");
        window.setTimeout(() => setNotice(""), 3000);
        return;
      }

      const currentlyFavorite = favoriteIds.has(teacherId);
      const next = new Set(favoriteIds);

      if (currentlyFavorite) next.delete(teacherId);
      else next.add(teacherId);

      writeFavoriteIds(uid, next);
      setFavoriteIds(next);
    },
    [favoriteIds, uid],
  );

  const updateFilter = (name: keyof TeacherFilters, value: string) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setVisibleCount(pageSize);
  };

  const loadMore = async () => {
    await loadTeachers();
    setVisibleCount((count) => count + pageSize);
  };

  return (
    <section className="teachers-page">
      {notice && <div className="notice">{notice}</div>}

      <form className="filters" aria-label="Teacher filters">
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

      <ul className="teachers-list">
        {visibleTeachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            isFavorite={favoriteIds.has(teacher.id)}
            selectedLevel={filters.level}
            onToggleFavorite={() => toggleFavorite(teacher.id)}
          />
        ))}
      </ul>

      {!loading && visibleTeachers.length === 0 && (
        <p className="empty-state">No teachers found.</p>
      )}

      {hasMore && (
        <button className="load-more" onClick={loadMore} disabled={loading}>
          {loading ? "Loading..." : "Load more"}
        </button>
      )}
    </section>
  );
};
