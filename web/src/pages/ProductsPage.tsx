import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Heart, Grid3x3 } from 'lucide-react';
import { apiRequest } from '../api';
import { useAuth } from '../state/useAuth';
import { useToast } from '../state/useToast';
import ProductCard from '../ui/ProductCard';
import ShimmerCard from '../ui/ShimmerCard';

type ProductItem = {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
};

function ProductsPage() {
  const [searchParams] = useSearchParams();
  const { token, user, favoriteIds, favoriteLoadingIds, toggleFavorite: toggleFavoriteGlobal } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<ProductItem[]>([]);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (viewMode !== 'all') {
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiRequest(
          `/products?page=${page}&limit=8&q=${encodeURIComponent(query.trim())}`,
          { token }
        );
        setProducts(data.data);
        setPagination(data.pagination);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, query, token, viewMode]);

  useEffect(() => {
    if (viewMode !== 'favorites') {
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      setError('');
      try {
        let data;
        try {
          data = await apiRequest('/products/mine/favorites', { token });
        } catch {
          try {
            data = await apiRequest('/products/favorites', { token });
          } catch {
            const fallback = await apiRequest('/products?page=1&limit=50', { token });
            const favoriteIdSet = new Set(favoriteIds.map((id) => id.toString()));
            data = {
              data: (fallback.data || []).filter((item: ProductItem) => favoriteIdSet.has(item._id))
            };
          }
        }
        setFavoriteProducts(data.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds, token, viewMode]);

  const favoritesSet = useMemo(() => new Set(favoriteIds.map((item) => item.toString())), [favoriteIds]);

  const handleFavoriteToggle = useCallback(async (productId: string, isFavorite: boolean) => {
    let prevFavorites: ProductItem[] = [];
    try {
      if (viewMode === 'favorites' && isFavorite) {
        prevFavorites = favoriteProducts;
        setFavoriteProducts((prev) => prev.filter((item) => item._id !== productId));
      }

      await toggleFavoriteGlobal(productId, isFavorite);
      showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (err: unknown) {
      if (viewMode === 'favorites' && isFavorite) {
        setFavoriteProducts(prevFavorites);
      }
      const message = err instanceof Error ? err.message : 'Unable to update favorite';
      setError(message);
      showToast(message, 'error');
    }
  }, [favoriteProducts, showToast, toggleFavoriteGlobal, viewMode]);

  const onSwitchMode = (mode) => {
    setViewMode(mode);
    setError('');
    if (mode === 'all') {
      setPage(1);
    }
  };

  const displayedProducts =
    viewMode === 'favorites'
      ? favoriteProducts.filter((product) => {
          const term = query.trim().toLowerCase();
          if (!term) return true;
          return (
            product.title.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)
          );
        })
      : products;

  const totalPages = Math.max(1, pagination.totalPages || 1);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (number) => Math.abs(number - pagination.page) <= 1 || number === 1 || number === totalPages
  );
  const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

  return (
    <section className="space-y-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-linear-to-br from-white via-slate-50/80 to-zinc-100/50 p-4 shadow-xl backdrop-blur-sm sm:p-5">
        {/* Decorative Elements */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-linear-to-br from-indigo-400/20 to-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-linear-to-tr from-cyan-400/20 to-blue-500/20 blur-3xl" />
        
        <div className="relative">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Marketplace
                </p>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Discover <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Premium</span> Products
              </h1>
              <p className="text-xs text-slate-600 sm:text-sm">Curated collection of quality items</p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 sm:gap-4">
              <div className="rounded-xl border border-slate-200/60 bg-white/80 px-3 py-2 text-center backdrop-blur-sm">
                <div className="flex items-center justify-center gap-1">
                  <Package className="h-4 w-4 text-slate-600" />
                  <p className="text-xl font-bold text-slate-900">{pagination.total}</p>
                </div>
                <p className="text-[10px] font-medium text-slate-500">Products</p>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white/80 px-3 py-2 text-center backdrop-blur-sm">
                <div className="flex items-center justify-center gap-1">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <p className="text-xl font-bold text-rose-500">{user?.favorites?.length || 0}</p>
                </div>
                <p className="text-[10px] font-medium text-slate-500">Favorites</p>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="mt-4 inline-flex rounded-xl border border-slate-300/60 bg-slate-100/80 p-1 shadow-sm backdrop-blur-sm">
            <button
              onClick={() => onSwitchMode('all')}
              className={`relative inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                viewMode === 'all'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {viewMode === 'all' && (
                <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 w-8 rounded-full bg-linear-to-r from-indigo-500 to-purple-500" />
              )}
              <Grid3x3 className="h-3.5 w-3.5" />
              <span>All Products</span>
            </button>
            <button
              onClick={() => onSwitchMode('favorites')}
              className={`relative inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                viewMode === 'favorites'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {viewMode === 'favorites' && (
                <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 w-8 rounded-full bg-linear-to-r from-rose-500 to-pink-500" />
              )}
              <Heart className="h-3.5 w-3.5" />
              <span>My Favorites</span>
            </button>
          </div>
        </div>
      </div>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {skeletonItems.map((item) => (
            <ShimmerCard key={item} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {displayedProducts.map((product, index) => {
              const isLastOddMobileCard =
                displayedProducts.length % 2 === 1 && index === displayedProducts.length - 1;

              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  isFavorite={favoritesSet.has(product._id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  busy={favoriteLoadingIds.includes(product._id)}
                  className={isLastOddMobileCard ? 'col-span-2 md:col-span-1' : ''}
                />
              );
            })}
          </div>

          {displayedProducts.length === 0 && (
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-linear-to-br from-white to-slate-50 p-12 text-center shadow-xl">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-linear-to-br from-indigo-400/10 to-purple-500/10 blur-2xl" />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-slate-100 to-slate-200">
                  <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {viewMode === 'favorites' ? 'No favorites yet' : 'No products found'}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {viewMode === 'favorites' ? 'Start adding products to your favorites!' : 'Try adjusting your search criteria'}
                </p>
              </div>
            </div>
          )}

          {viewMode === 'all' && (
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/60 bg-linear-to-br from-white to-slate-50/80 p-4 shadow-xl backdrop-blur-sm sm:mt-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-slate-600">
                  Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
                  <span className="font-bold text-slate-900">{totalPages}</span>
                  <span className="mx-2 inline-block h-1 w-1 rounded-full bg-slate-400" />
                  <span className="font-semibold text-indigo-600">{pagination.total}</span> products
                </p>

                <div className="flex items-center justify-between gap-2 sm:hidden">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl bg-linear-to-r from-slate-900 to-slate-800 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    ← Prev
                  </button>

                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-slate-900">
                    {pagination.page} / {totalPages}
                  </span>

                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-xl bg-linear-to-r from-slate-900 to-slate-800 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Next →
                  </button>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl bg-linear-to-r from-slate-900 to-slate-800 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    ← Previous
                  </button>

                  {pageNumbers.map((number, index) => {
                    const prev = pageNumbers[index - 1];
                    const showEllipsis = prev && number - prev > 1;

                    return (
                      <div key={number} className="flex items-center gap-2">
                        {showEllipsis && <span className="px-1 text-slate-400">•••</span>}
                        <button
                          onClick={() => setPage(number)}
                          className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold shadow-lg transition-all ${
                            number === pagination.page
                              ? 'scale-110 bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30'
                              : 'bg-white text-slate-700 hover:scale-105 hover:bg-slate-50 hover:shadow-xl'
                          }`}
                        >
                          {number}
                        </button>
                      </div>
                    );
                  })}

                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-xl bg-linear-to-r from-slate-900 to-slate-800 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ProductsPage;
