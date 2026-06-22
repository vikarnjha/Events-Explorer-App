import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarSearch,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  SearchX,
  Sparkles,
  X
} from "lucide-react";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";
import SkeletonCard from "../components/SkeletonCard";
import { searchEvents } from "../services/eventService";

const TRENDING_QUERY = "event";
const DEFAULT_TOTAL_PAGES = 1;
const requestCache = new Map();

const getEvents = (searchTerm, page) => {
  const cacheKey = `${searchTerm.trim().toLowerCase()}::${page}`;

  if (!requestCache.has(cacheKey)) {
    const request = searchEvents(searchTerm, page).finally(() => {
      requestCache.delete(cacheKey);
    });

    requestCache.set(cacheKey, request);
  }

  return requestCache.get(cacheKey);
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(TRENDING_QUERY);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(DEFAULT_TOTAL_PAGES);
  const [searchVersion, setSearchVersion] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const latestRequestId = useRef(0);

  const filteredEvents = useMemo(() => {
    if (category === "All") {
      return events;
    }

    const selectedCategory = category.toLowerCase();

    return events.filter(
      (event) => event.category?.toLowerCase() === selectedCategory
    );
  }, [category, events]);

  const fetchEvents = useCallback(async (term, currentPage) => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;

    try {
      setLoading(true);
      setError("");

      const data = await getEvents(term, currentPage);

      if (latestRequestId.current !== requestId) {
        return;
      }

      setEvents(Array.isArray(data?.events) ? data.events : []);
      setPage(data?.page ?? currentPage);
      setTotalPages(data?.totalPages || DEFAULT_TOTAL_PAGES);
    } catch (err) {
      if (latestRequestId.current !== requestId) {
        return;
      }

      console.error(err);
      setError("Failed to fetch events. Please try again.");
      setEvents([]);
      setTotalPages(DEFAULT_TOTAL_PAGES);
    } finally {
      if (latestRequestId.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isCurrentEffect = true;

    queueMicrotask(() => {
      if (isCurrentEffect) {
        fetchEvents(searchTerm, page);
      }
    });

    return () => {
      isCurrentEffect = false;
    };
  }, [fetchEvents, page, searchTerm, searchVersion]);

  useEffect(() => {
    if (!selectedEvent) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedEvent(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedEvent]);

  const runSearch = useCallback((term) => {
    const nextSearchTerm = term.trim() || TRENDING_QUERY;

    setLoading(true);
    setQuery(term);
    setHasSearched(Boolean(term.trim()));
    setSearchTerm(nextSearchTerm);
    setPage(0);
    setSearchVersion((currentVersion) => currentVersion + 1);
  }, []);

  const handlePrevious = useCallback(() => {
    setLoading(true);
    setPage((currentPage) => Math.max(currentPage - 1, 0));
  }, []);

  const handleNext = useCallback(() => {
    setLoading(true);
    setPage((currentPage) => Math.min(currentPage + 1, totalPages - 1));
  }, [totalPages]);

  const handleRetry = useCallback(() => {
    fetchEvents(searchTerm, page);
  }, [fetchEvents, page, searchTerm]);

  const handleViewEvent = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const closeEventViewer = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const pageTitle = hasSearched ? "Search Results" : "Trending Events";
  const showNoEvents = !loading && !error && filteredEvents.length === 0;
  const showPagination = !loading && !error && totalPages > 1;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#e0e7ff,_transparent_32%),linear-gradient(135deg,_#f8fafc,_#ffffff_45%,_#eef6ff)]">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-indigo-100/70 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Hero */}
        <section className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 px-5 py-10 text-center shadow-2xl shadow-slate-200/70 backdrop-blur sm:px-8 lg:px-14 lg:py-14">
          <div className="absolute -left-20 top-8 h-44 w-44 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="relative mx-auto max-w-4xl">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              <Sparkles aria-hidden="true" size={16} />
              Curated events, concerts, sports and more
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Discover Amazing Events
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Search live concerts, conferences, sports events and memorable
              experiences happening around you.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => runSearch(TRENDING_QUERY)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-semibold text-white shadow-lg shadow-slate-300/70 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 sm:w-auto"
              >
                <CalendarSearch aria-hidden="true" size={18} />
                Explore Trending
              </button>

              <div className="grid w-full grid-cols-3 gap-2 text-center sm:w-auto">
                <div className="rounded-xl bg-white/80 px-4 py-3 ring-1 ring-slate-200">
                  <div className="text-lg font-bold text-slate-950">Live</div>
                  <div className="text-xs font-medium text-slate-500">data</div>
                </div>
                <div className="rounded-xl bg-white/80 px-4 py-3 ring-1 ring-slate-200">
                  <div className="text-lg font-bold text-slate-950">12</div>
                  <div className="text-xs font-medium text-slate-500">per page</div>
                </div>
                <div className="rounded-xl bg-white/80 px-4 py-3 ring-1 ring-slate-200">
                  <div className="text-lg font-bold text-slate-950">Fast</div>
                  <div className="text-xs font-medium text-slate-500">search</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SearchBar
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          loading={loading}
          onSearch={runSearch}
          onQuickSearch={runSearch}
        />

        {/* Error */}
        {error && (
          <section
            role="alert"
            className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50/90 p-5 text-red-700 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle aria-hidden="true" size={20} />
              </span>
              <div>
                <h2 className="font-bold text-red-900">Unable to load events</h2>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
            >
              <RotateCcw aria-hidden="true" size={16} />
              Retry
            </button>
          </section>
        )}

        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              {hasSearched ? "Matching your search" : "Popular right now"}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
              {pageTitle}
            </h2>

            {!loading && filteredEvents.length > 0 && (
              <p className="mt-2 text-slate-600">
                Found{" "}
                <span className="font-semibold text-slate-950">
                  {filteredEvents.length}
                </span>{" "}
                events on this page
              </p>
            )}
          </div>

          {!loading && !error && (
            <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
              Page {page + 1} of {totalPages}
            </p>
          )}
        </section>

        {/* Loading */}
        {loading ? (
          <section
            aria-label="Loading events"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <SkeletonCard key={index} />
            ))}
          </section>
        ) : filteredEvents.length > 0 ? (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewEvent={handleViewEvent}
              />
            ))}
          </section>
        ) : (
          showNoEvents && (
            <section className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-200/70 sm:p-12">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <SearchX aria-hidden="true" size={30} />
              </div>

              <h2 className="text-2xl font-bold text-slate-950">
                No events found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-slate-500">
                Try a broader keyword, switch the category filter, or jump back
                into trending events.
              </p>

              <button
                type="button"
                onClick={() => runSearch(TRENDING_QUERY)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                <CalendarSearch aria-hidden="true" size={18} />
                Show Trending
              </button>
            </section>
          )
        )}

        {showPagination && (
          <nav
            aria-label="Event results pagination"
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={handlePrevious}
              disabled={page === 0}
              aria-label="Go to previous page"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-3
                font-semibold
                text-slate-700
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:bg-slate-50
                focus:outline-none
                focus:ring-4
                focus:ring-indigo-100
                disabled:opacity-50
                disabled:hover:translate-y-0
              "
            >
              <ChevronLeft aria-hidden="true" size={18} />
              Previous
            </button>

            <span
              aria-current="page"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300/70"
            >
              Page {page + 1} of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={page >= totalPages - 1}
              aria-label="Go to next page"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-3
                font-semibold
                text-slate-700
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:bg-slate-50
                focus:outline-none
                focus:ring-4
                focus:ring-indigo-100
                disabled:opacity-50
                disabled:hover:translate-y-0
              "
            >
              Next
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </nav>
        )}
      </div>

      {selectedEvent?.url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-viewer-title"
        >
          <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/40">
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Event Preview
                </p>
                <h2
                  id="event-viewer-title"
                  className="truncate text-lg font-bold text-slate-950"
                >
                  {selectedEvent.title || "Event details"}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedEvent.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                >
                  <ExternalLink aria-hidden="true" size={16} />
                  Open externally
                </a>

                <button
                  type="button"
                  onClick={closeEventViewer}
                  aria-label="Close event preview"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                >
                  <X aria-hidden="true" size={20} />
                </button>
              </div>
            </div>

            <div className="bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:px-5">
              If the event page does not load, Ticketmaster may be blocking
              iframe embedding. Use “Open externally” as a fallback.
            </div>

            <iframe
              src={selectedEvent.url}
              title={`${selectedEvent.title || "Event"} Ticketmaster preview`}
              className="h-full w-full flex-1 border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </main>
  );
}
