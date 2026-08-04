import { useState } from "react";
import unplugged from "../assets/unplugged.png";

/**
 * Presentational image with a shimmer skeleton while loading and a graceful
 * fallback on error. Purely visual — no data/fetch logic. When `skeleton` is
 * true the parent element must be positioned (the skeleton fills it absolutely).
 */
export const ShopImage = ({
  src,
  alt,
  className,
  fallback = unplugged,
  skeleton = false,
  imgStyle,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const showSkeleton = skeleton && !loaded && !errored;

  return (
    <>
      {showSkeleton && <span className="shop-skel shop-img-skel" aria-hidden="true" />}
      <img
        src={errored || !src ? fallback : src}
        alt={alt}
        className={className}
        style={{ ...imgStyle, opacity: loaded || errored ? 1 : 0 }}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setErrored(true);
          setLoaded(true);
        }}
      />
    </>
  );
};

/**
 * Star rating — renders nothing when there's no rating value, so it stays a
 * pure "UI shell" that only appears once the data provides a `rating` field.
 */
export const StarRating = ({ value, count }) => {
  if (value == null || Number.isNaN(Number(value))) return null;
  const rating = Number(value);
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  const icons = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "bi-star-fill";
    if (i === full && half) return "bi-star-half";
    return "bi-star";
  });

  return (
    <span className="shop-stars" aria-label={`Rated ${rating} out of 5`}>
      {icons.map((cls, i) => (
        <i key={i} className={`bi ${cls}`} aria-hidden="true"></i>
      ))}
      {count != null && <span className="shop-rating-count">({count})</span>}
    </span>
  );
};

/** Consistent price formatting in USD across every page. */
export const Price = ({ value, className }) => {
  const num = Number(value);
  const formatted = Number.isNaN(num) ? value : num.toLocaleString("en-US");
  return <span className={className}>${formatted}</span>;
};

/** Stock badge derived from real product fields. */
export const StockBadge = ({ available, quantity }) => {
  if (!available) {
    return (
      <span className="shop-badge shop-badge--out">
        <i className="bi bi-x-circle" aria-hidden="true"></i> Out of stock
      </span>
    );
  }
  if (typeof quantity === "number" && quantity > 0 && quantity <= 5) {
    return (
      <span className="shop-badge shop-badge--low">
        <i className="bi bi-exclamation-circle" aria-hidden="true"></i> Only {quantity} left
      </span>
    );
  }
  return (
    <span className="shop-badge shop-badge--in">
      <i className="bi bi-check-circle" aria-hidden="true"></i> In stock
    </span>
  );
};
