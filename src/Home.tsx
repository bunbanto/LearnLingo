import { Link } from "react-router-dom";
import heroImage from "./assets/hero.png";

const stats = [
  ["32,000+", "Experienced tutors"],
  ["300,000+", "5-star reviews"],
  ["120+", "Subjects taught"],
  ["200+", "Tutor nationalities"],
];

export const Home = () => {
  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="home-copy">
          <h1>
            Unlock your potential with the best{" "}
            <span>language</span> tutors
          </h1>
          <p>
            Learn with verified online teachers, choose the pace that fits your
            goals, and book a trial lesson when you find the right match.
          </p>
          <Link className="primary-link" to="/teachers">
            Get started
          </Link>
        </div>
        <div className="home-media" aria-hidden="true">
          <img src={heroImage} alt="" />
        </div>
      </div>

      <ul className="stats-list" aria-label="LearnLingo advantages">
        {stats.map(([value, label]) => (
          <li key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
