import {
  Calendar,
  Eye,
  MapPin,
  Tag
} from "lucide-react";
import { memo } from "react";

function EventCard({ event, onViewEvent }) {
  const hasEventUrl = Boolean(event.url);

  const handleViewEvent = () => {
    if (!hasEventUrl) {
      return;
    }

    onViewEvent(event);
  };

  return (
    <article
      className="
      group
      bg-white
      rounded-2xl
      shadow-md
      shadow-slate-200/70
      border border-slate-100
      overflow-hidden
      hover:shadow-2xl
      hover:shadow-slate-300/70
      transition-all
      duration-300
      hover:-translate-y-1.5
      flex flex-col
      h-full
      focus-within:ring-4
      focus-within:ring-indigo-100
      "
    >
      {/* Event Image */}
      <div className="relative overflow-hidden bg-slate-100">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title || "Event image"}
            loading="lazy"
            className="
            w-full
            h-56
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-110
            "
          />
        ) : (
          <div className="flex h-56 items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-50 text-sm font-semibold text-slate-400">
            Event image unavailable
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />

        {/* Category Badge */}
        {event.category && (
          <span
            className="
            absolute
            top-3
            left-3
            bg-white/90
            backdrop-blur
            text-indigo-700
            ring-1
            ring-white/70
            text-xs
            font-bold
            px-3
            py-1.5
            rounded-full
            shadow-sm
            "
          >
            {event.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
          <h3
            className="
            text-lg
            font-bold
            leading-snug
            text-slate-950
            line-clamp-2
            min-h-14
            "
          >
            {event.title || "Untitled Event"}
          </h3>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Calendar size={16} />
            </span>
            <span className="font-medium">{event.date || "Date TBA"}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <MapPin size={16} />
            </span>
            <span className="line-clamp-1">{event.venue || "Venue TBA"}</span>
          </div>

          {event.city && (
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <Tag size={16} />
              </span>
              <span>{event.city}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={handleViewEvent}
            disabled={!hasEventUrl}
            aria-label={
              hasEventUrl
                ? `View ${event.title} details inside the app`
                : "Event link unavailable"
            }
            className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            bg-slate-950
            hover:bg-indigo-700
            text-white
            py-3
            rounded-xl
            font-semibold
            transition-all
            duration-200
            cursor-pointer
            hover:-translate-y-0.5
            focus:outline-none
            focus:ring-4
            focus:ring-indigo-200
            disabled:cursor-not-allowed
            disabled:opacity-50
            disabled:hover:translate-y-0
            disabled:hover:bg-slate-950
            "
          >
            <span>{hasEventUrl ? "View Event" : "Link Unavailable"}</span>
            {hasEventUrl && <Eye aria-hidden="true" size={16} />}
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(EventCard);
