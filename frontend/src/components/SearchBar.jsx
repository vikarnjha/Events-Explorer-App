import { Search, Sparkles } from "lucide-react";
import { memo } from "react";

const quickSearches = [
  "music",
  "sports",
  "concert",
  "festival"
];

function SearchBar({
  query,
  setQuery,
  category,
  setCategory,
  loading,
  onSearch,
  onQuickSearch
}) {
  const handleSubmit = () => {
    onSearch(query);
  };

  const handleQuickSearch = (quickSearch) => {
    setQuery(quickSearch);
    onQuickSearch(quickSearch);
  };

  return (
    <section
      aria-label="Search events"
      className="
        bg-white/90
        backdrop-blur
        rounded-2xl
        shadow-xl
        shadow-slate-200/70
        ring-1
        ring-slate-200
        p-4
        sm:p-5
        mb-10
      "
    >
      <div className="flex flex-col lg:flex-row gap-3">
        <label className="sr-only" htmlFor="event-search">
          Search city or event keyword
        </label>

        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />

          <input
            id="event-search"
            type="search"
            placeholder="Search city, artist, venue, or event..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            className="
              w-full
              border
              border-slate-200
              bg-slate-50
              rounded-xl
              pl-12
              pr-4
              py-3.5
              text-slate-900
              placeholder:text-slate-400
              outline-none
              transition
              focus:border-indigo-500
              focus:bg-white
              focus:ring-4
              focus:ring-indigo-100
            "
          />
        </div>

        <label className="sr-only" htmlFor="event-category">
          Filter by category
        </label>
        <select
          id="event-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="
            border
            border-slate-200
            bg-slate-50
            rounded-xl
            px-4
            py-3.5
            text-slate-800
            outline-none
            transition
            focus:border-indigo-500
            focus:bg-white
            focus:ring-4
            focus:ring-indigo-100
            lg:min-w-52
          "
        >
          <option value="All">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Arts & Theatre">Arts</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          aria-label="Search events"
          className="
            bg-slate-950
            hover:bg-indigo-700
            text-white
            px-8
            py-3.5
            rounded-xl
            font-semibold
            shadow-lg
            shadow-slate-300/70
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:shadow-indigo-200
            focus:outline-none
            focus:ring-4
            focus:ring-indigo-200
            disabled:opacity-50
            disabled:hover:translate-y-0
            disabled:hover:bg-slate-950
          "
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Sparkles aria-hidden="true" size={16} className="text-indigo-500" />
          Quick searches
        </div>

        <div className="flex flex-wrap gap-2.5">
          {quickSearches.map((quickSearch) => (
            <button
              key={quickSearch}
              type="button"
              onClick={() => handleQuickSearch(quickSearch)}
              disabled={loading}
              aria-label={`Search ${quickSearch} events`}
              className="
                px-4
                py-2.5
                bg-slate-100
                hover:bg-indigo-50
                hover:text-indigo-700
                ring-1
                ring-slate-200
                hover:ring-indigo-200
                rounded-full
                text-sm
                font-semibold
                text-slate-700
                capitalize
                transition-all
                hover:-translate-y-0.5
                focus:outline-none
                focus:ring-4
                focus:ring-indigo-100
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0
              "
            >
              {quickSearch}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(SearchBar);
