import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Tag } from 'lucide-react';
import { apiRequest } from '../api';
import { useAuth } from '../state/useAuth';
import { useToast } from '../state/useToast';

type ProductItem = {
  _id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
};

function ProductDetailPage() {
  const { id } = useParams();
  const { token, favoriteIds, favoriteLoadingIds, toggleFavorite } = useAuth();
  const { showToast } = useToast();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiRequest(`/products/${id}`, { token });
        setProduct(data);
        setSelectedImage(data.image || '');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  const isFavorite = useMemo(() => favoriteIds.some((item) => item.toString() === id), [favoriteIds, id]);
  const busy = id ? favoriteLoadingIds.includes(id) : false;
  const galleryImages = useMemo(() => {
    if (!product) {
      return [];
    }

    const extras = (product.images || []).slice(0, 4);
    return [product.image, ...extras].filter((imageUrl, index, array) => array.indexOf(imageUrl) === index);
  }, [product]);

  const onFavoriteToggle = async () => {
    try {
      if (!id) return;
      await toggleFavorite(id, isFavorite);
      showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to update favorite';
      setError(message);
      showToast(message, 'error');
    }
  };

  if (loading) {
    return <p className="text-center text-slate-500">Loading product...</p>;
  }

  if (error) {
    return <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>;
  }

  if (!product) {
    return <p className="text-center text-slate-500">Product not found.</p>;
  }

  return (
    <section className="space-y-4">
      <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to products</span>
      </Link>

      <article className="grid gap-6 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xl ring-1 ring-white md:grid-cols-2 md:p-6">
        <div className="space-y-3">
          <img
            src={selectedImage || product.image}
            alt={product.title}
            className="h-64 w-full rounded-xl object-cover sm:h-80"
          />

          {galleryImages.length > 1 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {galleryImages.slice(1).map((imageUrl, index) => (
                <button
                  key={`${product._id}-alt-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(imageUrl)}
                  className={`overflow-hidden rounded-lg border transition ${
                    selectedImage === imageUrl
                      ? 'border-slate-900 ring-2 ring-slate-300'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`${product.title} view ${index + 2}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Product Detail
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{product.title}</h1>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-slate-500" />
            <p className="text-2xl font-semibold tracking-tight text-slate-800">${product.price.toFixed(2)}</p>
          </div>
          <p className="text-slate-600">{product.description}</p>

          <button
            disabled={busy}
            onClick={onFavoriteToggle}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-medium text-white shadow-sm transition hover:-translate-y-0.5 sm:w-auto ${
              isFavorite ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-900 hover:bg-slate-800'
            } disabled:opacity-60`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{busy ? 'Saving...' : isFavorite ? 'Remove Favorite' : 'Add to Favorites'}</span>
          </button>
        </div>
      </article>
    </section>
  );
}

export default ProductDetailPage;
