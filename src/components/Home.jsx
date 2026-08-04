import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "../axios";
import unplugged from "../assets/unplugged.png";
import { ShopImage, StarRating, Price } from "./ui";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get("/products");
              setProducts(response.data);
              console.log(response.data);
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <div className="shop-grid">
        <div className="shop-empty">
          <img src={unplugged} alt="" style={{ width: "96px", height: "96px", opacity: 0.85 }} />
          <h2>Something went wrong</h2>
          <p>We couldn't load products right now. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Still loading when the catalog hasn't arrived yet and there's no error.
  const isLoading = (!data || data.length === 0) && !isError;

  if (isLoading) {
    return (
      <div className="shop-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="shop-card" key={i} aria-hidden="true">
            <div className="shop-card__media">
              <span className="shop-skel shop-img-skel" />
            </div>
            <div className="shop-card__body">
              <span className="shop-skel shop-skel--line" style={{ width: "80%" }} />
              <span className="shop-skel shop-skel--line" style={{ width: "50%" }} />
              <div className="shop-card__meta">
                <span className="shop-skel shop-skel--line" style={{ width: "40%", height: "1.4rem" }} />
              </div>
            </div>
            <div className="shop-card__actions">
              <span className="shop-skel shop-skel--line" style={{ width: "100%", height: "2.6rem" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="shop-grid">
      {filteredProducts.length === 0 ? (
        <div className="shop-empty">
          <i className="bi bi-search shop-empty__icon" aria-hidden="true"></i>
          <h2>No products found</h2>
          <p>
            {selectedCategory
              ? `We don't have anything in "${selectedCategory}" right now.`
              : "Check back soon — new products are on the way."}
          </p>
        </div>
      ) : (
        filteredProducts.map((product) => {
          const {
            id,
            brand,
            name,
            price,
            productAvailable,
            imageUrl,
            releaseDate,
            stockQuantity,
            rating,
            reviewCount,
          } = product;

          return (
            <div className="shop-card" key={id}>
              <Link to={`/product/${id}`} className="shop-card__link">
                <div className="shop-card__media">
                  <span
                    className={`shop-badge shop-badge--float ${
                      productAvailable ? "shop-badge--in" : "shop-badge--out"
                    }`}
                  >
                    {productAvailable ? "In stock" : "Out of stock"}
                  </span>
                  <ShopImage
                    src={imageUrl}
                    alt={name}
                    className="shop-card__img"
                    skeleton
                  />
                </div>
                <div className="shop-card__body">
                  <h3 className="shop-card__name">{name}</h3>
                  <span className="shop-card__brand">{brand}</span>
                  <StarRating value={rating} count={reviewCount} />
                  <div className="shop-card__meta">
                    <Price className="shop-card__price" value={price} />
                    <span className="shop-card__date">
                      {releaseDate ? `Listed ${releaseDate}` : ""}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="shop-card__actions">
                <button
                  className="shop-btn shop-btn--primary shop-btn--block"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  disabled={!productAvailable}
                  aria-label={
                    productAvailable ? `Add ${name} to cart` : `${name} is out of stock`
                  }
                >
                  <i className="bi bi-cart-plus" aria-hidden="true"></i>
                  {productAvailable ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Home;
