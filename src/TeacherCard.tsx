import { yupResolver } from "@hookform/resolvers/yup";
import { BookOpen, Heart, Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Modal } from "./Modal";
import type { Teacher } from "./types";

type TeacherCardProps = {
  teacher: Teacher;
  isFavorite: boolean;
  selectedLevel?: string;
  onToggleFavorite: () => void;
};

type BookingValues = {
  reason: string;
  name: string;
  email: string;
  phone: string;
};

const bookingSchema: yup.ObjectSchema<BookingValues> = yup.object({
  reason: yup.string().required("Choose a reason"),
  name: yup.string().trim().min(2, "Min 2 characters").required("Required"),
  email: yup.string().trim().email("Enter a valid email").required("Required"),
  phone: yup.string().trim().min(7, "Enter a valid phone").required("Required"),
});

const reasons = [
  "Career and business",
  "Lesson for kids",
  "Living abroad",
  "Exams and coursework",
  "Culture, travel or hobby",
];

export const TeacherCard = ({
  teacher,
  isFavorite,
  selectedLevel,
  onToggleFavorite,
}: TeacherCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const fullName = `${teacher.name} ${teacher.surname}`;

  return (
    <li className="teacher-card">
      <div className="avatar-wrap">
        <img className="teacher-avatar" src={teacher.avatar_url} alt={fullName} />
      </div>

      <div className="teacher-content">
        <div className="teacher-topline">
          <p className="teacher-role">Languages</p>
          <div className="teacher-stats">
            <span>
              <BookOpen size={16} /> Lessons online
            </span>
            <span>Lessons done: {teacher.lessons_done}</span>
            <span>
              <Star size={16} fill="currentColor" /> Rating: {teacher.rating}
            </span>
            <span>
              Price / 1 hour: <b>{teacher.price_per_hour}$</b>
            </span>
          </div>
          <button
            type="button"
            className={`favorite-btn ${isFavorite ? "is-favorite" : ""}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={onToggleFavorite}
          >
            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <h2 className="teacher-name">{fullName}</h2>

        <dl className="teacher-details">
          <div>
            <dt>Speaks:</dt>
            <dd className="underlined">{teacher.languages.join(", ")}</dd>
          </div>
          <div>
            <dt>Lesson Info:</dt>
            <dd>{teacher.lesson_info}</dd>
          </div>
          <div>
            <dt>Conditions:</dt>
            <dd>{teacher.conditions.join(" ")}</dd>
          </div>
        </dl>

        {!isExpanded && (
          <button
            type="button"
            className="read-more-btn"
            onClick={() => setIsExpanded(true)}
          >
            Read more
          </button>
        )}

        {isExpanded && (
          <div className="expanded-info">
            <p className="experience">{teacher.experience}</p>
            <ul className="reviews-list">
              {teacher.reviews.map((review) => (
                <li key={`${teacher.id}-${review.reviewer_name}`}>
                  <div>
                    <span className="review-avatar">
                      {review.reviewer_name.charAt(0)}
                    </span>
                    <div>
                      <p>{review.reviewer_name}</p>
                      <span>
                        <Star size={14} fill="currentColor" />{" "}
                        {review.reviewer_rating}
                      </span>
                    </div>
                  </div>
                  <p>{review.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="levels-list">
          {teacher.levels.map((level) => (
            <li
              className={selectedLevel === level ? "is-selected" : ""}
              key={`${teacher.id}-${level}`}
            >
              #{level}
            </li>
          ))}
        </ul>

        {isExpanded && (
          <button
            type="button"
            className="book-btn"
            onClick={() => setIsBookingOpen(true)}
          >
            Book trial lesson
          </button>
        )}
      </div>

      {isBookingOpen && (
        <Modal onClose={() => setIsBookingOpen(false)}>
          <BookingForm
            teacher={teacher}
            onSuccess={() => setIsBookingOpen(false)}
          />
        </Modal>
      )}
    </li>
  );
};

const BookingForm = ({
  teacher,
  onSuccess,
}: {
  teacher: Teacher;
  onSuccess: () => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: yupResolver(bookingSchema),
    defaultValues: { reason: "", name: "", email: "", phone: "" },
  });

  const submit = async () => {
    reset();
    onSuccess();
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit(submit)}>
      <h2>Book trial lesson</h2>
      <p>
        Choose a lesson goal and send your contact details for{" "}
        {teacher.name} {teacher.surname}.
      </p>

      <div className="booking-teacher">
        <img src={teacher.avatar_url} alt="" />
        <div>
          <span>Your teacher</span>
          <strong>
            {teacher.name} {teacher.surname}
          </strong>
        </div>
      </div>

      <fieldset className="radio-group">
        <legend>What is your main reason for learning English?</legend>
        {reasons.map((reason) => (
          <label key={reason}>
            <input type="radio" value={reason} {...register("reason")} />
            {reason}
          </label>
        ))}
        {errors.reason && <span>{errors.reason.message}</span>}
      </fieldset>

      <label className="auth-label">
        Full name
        <input className="auth-input" type="text" {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </label>

      <label className="auth-label">
        Email
        <input className="auth-input" type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </label>

      <label className="auth-label">
        Phone number
        <input className="auth-input" type="tel" {...register("phone")} />
        {errors.phone && <span>{errors.phone.message}</span>}
      </label>

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        Book
      </button>
    </form>
  );
};
