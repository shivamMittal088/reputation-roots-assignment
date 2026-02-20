import { memo, useState } from 'react';
import { Link } from 'react-router-dom';

type ProductItem = {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
};

type ProductCardProps = {
  product: ProductItem;
  isFavorite: boolean;
  onFavoriteToggle: (productId: string, isFavorite: boolean) => void;
  busy: boolean;
  className?: string;
};

function ProductCard({ product, isFavorite, onFavoriteToggle, busy, className = '' }: ProductCardProps) {
  const [isPopping, setIsPopping] = useState(false);

  const onFavoriteClick = () => {
    setIsPopping(true);
    onFavoriteToggle(product._id, isFavorite);
    setTimeout(() => setIsPopping(false), 260);
  };

  return (
    <article className={`group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 ${className}`}>
      {/* Gradient Overlay on Hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/5 via-transparent to-transparent" />
      </div>
      
      <div className="relative h-32 overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 sm:h-40">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute left-2 top-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-lg backdrop-blur sm:px-2.5 sm:text-[10px]">
          ✨ Premium
        </span>
      </div>
      <div className="relative space-y-1.5 p-2.5 sm:space-y-2 sm:p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-xs font-bold leading-tight text-slate-900 transition-colors duration-200 group-hover:text-indigo-600 sm:text-sm">{product.title}</h3>
          </div>
          <button
            disabled={busy}
            onClick={onFavoriteClick}
            className={`relative z-10 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 sm:h-8 sm:w-8 ${
              isFavorite
                ? 'bg-linear-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/50 hover:shadow-xl hover:shadow-rose-500/60'
                : 'border-2 border-slate-200 bg-white text-slate-400 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 hover:shadow-md'
            } ${isPopping ? 'heart-pop' : ''} ${busy ? 'opacity-70' : ''}`}
            aria-label={isFavorite ? 'Unfavorite product' : 'Favorite product'}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-6.7-4.35-9.34-8.02C.83 10.43 1.27 6.96 4.02 5.2a5.3 5.3 0 0 1 6.2.45L12 7.27l1.78-1.62a5.3 5.3 0 0 1 6.2-.45c2.75 1.76 3.19 5.23 1.36 7.78C18.7 16.65 12 21 12 21Z" />
            </svg>
          </button>
        </div>

        <p className="line-clamp-2 text-[11px] leading-snug text-slate-600 sm:text-xs">{product.description}</p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
          <div>
            <p className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-base font-black tracking-tight text-transparent sm:text-lg">${product.price.toFixed(2)}</p>
          </div>
          <Link
            to={`/products/${product._id}`}
            className="group/btn relative overflow-hidden rounded-xl bg-linear-to-r from-slate-900 to-slate-800 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-slate-900/30 sm:px-4 sm:py-2 sm:text-xs"
          >
            <span className="relative z-10">View</span>
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-indigo-600 to-purple-600 transition-transform duration-300 group-hover/btn:translate-x-0" />
            <span className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100">View</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
