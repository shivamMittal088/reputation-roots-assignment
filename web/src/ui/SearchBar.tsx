import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Clock, X, Tag } from 'lucide-react';
import { apiRequest } from '../api';

const RECENT_SEARCHES_KEY = 'mm-recent-searches';
const MAX_RECENT_SEARCHES = 6;

type ProductSuggestion = {
  _id: string;
  title: string;
  price: number;
};

interface SearchBarProps {
  token: string | null;
  setFavorites: (favorites: string[]) => void;
}

function SearchBar({ token, setFavorites }: SearchBarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const queryFromUrl = useMemo(() => new URLSearchParams(location.search).get('q') || '', [location.search]);
  const [searchInput, setSearchInput] = useState(queryFromUrl);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    } catch {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }

    return [];
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const displaySearchValue = isSearchFocused ? searchInput : queryFromUrl;
  const shouldShowRecentSearches = isSearchFocused && !displaySearchValue.trim() && recentSearches.length > 0;

  const shouldShowSuggestions =
    isSearchFocused &&
    ((displaySearchValue.trim() && suggestions.length > 0) || shouldShowRecentSearches);

  useEffect(() => {
    if (!token) {
      return;
    }

    apiRequest('/search/recent-searches', { token })
      .then((data) => {
        const synced = data.recentSearches || [];
        setRecentSearches(synced);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(synced));
      })
      .catch(() => {
        // fallback to local cache when backend route is unavailable
      });
  }, [token]);

  const persistLocalRecentSearches = (nextRecentSearches: string[]) => {
    setRecentSearches(nextRecentSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(nextRecentSearches));
  };

  const addRecentSearch = async (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }

    const deduped = recentSearches.filter((item) => item.toLowerCase() !== trimmedValue.toLowerCase());
    const optimisticRecents = [trimmedValue, ...deduped].slice(0, MAX_RECENT_SEARCHES);
    persistLocalRecentSearches(optimisticRecents);

    if (!token) {
      return;
    }

    try {
      const data = await apiRequest('/search/recent-searches', {
        method: 'POST',
        token,
        body: { term: trimmedValue }
      });
      const synced = data.recentSearches || optimisticRecents;
      persistLocalRecentSearches(synced);
    } catch {
      // keep optimistic local cache if backend sync fails
    }
  };

  const clearAllRecentSearches = async () => {
    if (!token) {
      persistLocalRecentSearches([]);
      return;
    }

    persistLocalRecentSearches([]);
    setFavorites([]);

    try {
      await Promise.all([
        apiRequest('/search/recent-searches', {
          method: 'DELETE',
          token
        }),
        apiRequest('/products/favorites', {
          method: 'DELETE',
          token
        })
      ]);
    } catch {
      // keep cleared local cache even if backend clear routes are unavailable
    }
  };

  const removeRecentSearch = async (term: string) => {
    const normalizedTerm = term.trim();
    if (!normalizedTerm) {
      return;
    }

    const previousRecents = recentSearches;
    const nextRecents = previousRecents.filter(
      (item) => item.toLowerCase() !== normalizedTerm.toLowerCase()
    );
    persistLocalRecentSearches(nextRecents);

    if (!token) {
      return;
    }

    try {
      const data = await apiRequest(`/search/recent-searches/${encodeURIComponent(normalizedTerm)}`, {
        method: 'DELETE',
        token
      });
      persistLocalRecentSearches(data.recentSearches || nextRecents);
    } catch {
      try {
        await apiRequest('/search/recent-searches', {
          method: 'DELETE',
          token
        });
      } catch {
        // keep optimistic local result
      }
    }
  };

  useEffect(() => {
    const term = displaySearchValue.trim();
    if (!token || !term) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await apiRequest(`/products?page=1&limit=5&q=${encodeURIComponent(term)}`, { token });
        setSuggestions(data.data || []);
      } catch {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [displaySearchValue, token]);

  const submitSearch = (value: string) => {
    const params = new URLSearchParams();
    const term = value.trim();
    if (term) {
      params.set('q', term);
      void addRecentSearch(term);
    }
    navigate(`/${params.toString() ? `?${params.toString()}` : ''}`);
    setIsSearchFocused(false);
  };

  const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch(displaySearchValue);
  };

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    if (!value.trim()) {
      setSuggestions([]);
    }
  };

  const onSearchFocus = () => {
    setSearchInput(queryFromUrl);
    setIsSearchFocused(true);
  };

  const onSearchBlur = () => {
    setTimeout(() => setIsSearchFocused(false), 120);
  };

  return (
    <>
      {isSearchFocused && <div className="pointer-events-none fixed inset-0 z-20 bg-slate-900/20" />}
      <form onSubmit={onSearchSubmit} className="order-3 relative w-full md:order-0 md:flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={displaySearchValue}
            onChange={onSearchChange}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
            placeholder="Search products..."
            className="w-full rounded-lg border border-stone-300 bg-white py-1.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200/70"
          />
        </div>

        {shouldShowSuggestions && (
          <ul className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-stone-200 bg-white/95 shadow-xl backdrop-blur">
            {shouldShowRecentSearches && (
              <li className="sticky top-0 z-10 border-b border-stone-200 bg-slate-900 px-3 py-2 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-300" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-white">Recent</span>
                  </div>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      void clearAllRecentSearches();
                    }}
                    className="rounded-md border border-slate-500 bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700"
                  >
                    Clear all
                  </button>
                </div>
              </li>
            )}

            {shouldShowRecentSearches && recentSearches.map((item) => (
              <li key={`recent-${item}`}>
                <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-stone-100/80">
                  <button
                    type="button"
                    onMouseDown={() => {
                      setSearchInput(item);
                      submitSearch(item);
                    }}
                    className="min-w-0 flex-1 text-left text-sm text-slate-800"
                  >
                    <span className="truncate">{item}</span>
                  </button>
                  <button
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void removeRecentSearch(item);
                    }}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-stone-200 hover:text-slate-700"
                    aria-label={`Remove ${item} from recent searches`}
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}

            {suggestions.map((item) => (
              <li key={item._id}>
                <button
                  type="button"
                  onMouseDown={() => {
                    setSearchInput(item.title);
                    submitSearch(item.title);
                  }}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm text-slate-800 hover:bg-stone-100/80"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Tag className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span className="shrink-0 font-semibold text-slate-500">${item.price.toFixed(2)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
}

export default SearchBar;
