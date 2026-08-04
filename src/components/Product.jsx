import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import UpdateProduct from "./UpdateProduct";
import { ShopImage, StarRating, StockBadge, Price } from "./ui";
const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } =
    useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(`/product/${id}/image`, {
        responseType: "blob",
      });
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    // Non-blocking inline confirmation instead of a blocking alert().
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  if (!product) {
    return (
      <div className="shop-pdp" aria-busy="true">
        <div className="shop-pdp__media">
          <span className="shop-skel shop-img-skel" />
        </div>
        <div className="shop-pdp__panel">
          <span className="shop-skel shop-skel--line" style={{ width: "30%" }} />
          <span className="shop-skel shop-skel--line" style={{ width: "70%", height: "2rem" }} />
          <span className="shop-skel shop-skel--line" style={{ width: "40%", height: "2rem" }} />
          <span className="shop-skel shop-skel--line" style={{ width: "100%" }} />
          <span className="shop-skel shop-skel--line" style={{ width: "90%" }} />
          <span className="shop-skel shop-skel--line" style={{ width: "100%", height: "3rem", marginTop: "1rem" }} />
        </div>
      </div>
    );
  }

  const lowStock =
    product.productAvailable &&
    typeof product.stockQuantity === "number" &&
    product.stockQuantity > 0 &&
    product.stockQuantity <= 5;

  return (
    <div className="shop-pdp">
      <div className="shop-pdp__media">
        <ShopImage
          className="shop-pdp__img"
          src={imageUrl}
          alt={product.name}
          skeleton
        />
      </div>

      <div className="shop-pdp__panel">
        <span className="shop-eyebrow">{product.category}</span>
        <h1 className="shop-pdp__title">{product.name}</h1>
        <span className="shop-pdp__brand">by {product.brand}</span>
        <StarRating value={product.rating} count={product.reviewCount} />

        <div className="shop-pdp__buyrow">
          <Price className="shop-pdp__price" value={product.price} />
          <StockBadge
            available={product.productAvailable}
            quantity={product.stockQuantity}
          />
        </div>

        {product.productAvailable && (
          <p style={{ margin: 0, color: lowStock ? "var(--shop-badge-low-fg)" : "var(--shop-text-muted)", fontSize: "var(--shop-fs-sm)" }}>
            {typeof product.stockQuantity === "number"
              ? `${product.stockQuantity} available`
              : ""}
          </p>
        )}

        <div className="shop-pdp__actions">
          <button
            className={`shop-btn shop-btn--lg ${added ? "shop-btn--success" : "shop-btn--primary"}`}
            onClick={handlAddToCart}
            disabled={!product.productAvailable}
            aria-label={
              product.productAvailable
                ? `Add ${product.name} to cart`
                : "Out of stock"
            }
          >
            <i
              className={`bi ${added ? "bi-check-lg" : "bi-cart-plus"}`}
              aria-hidden="true"
            ></i>
            {!product.productAvailable
              ? "Out of Stock"
              : added
              ? "Added to cart"
              : "Add to Cart"}
          </button>
        </div>

        <div className="shop-trust">
          <div className="shop-trust__row">
            <i className="bi bi-shield-check" aria-hidden="true"></i>
            Secure checkout — your details are encrypted
          </div>
          <div className="shop-trust__row">
            <i className="bi bi-truck" aria-hidden="true"></i>
            Fast, tracked delivery
          </div>
          <div className="shop-trust__row">
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
            Easy returns
          </div>
        </div>

        <hr className="shop-divider" />

        <div>
          <p className="shop-section-label">Product description</p>
          <p className="shop-pdp__desc">{product.description}</p>
        </div>

        <p className="shop-card__date" style={{ marginTop: "0.25rem" }}>
          Listed {product.releaseDate || "N/A"}
        </p>

        <div className="shop-admin">
          <p className="shop-section-label">Admin</p>
          <div className="shop-admin__actions">
            <button
              className="shop-btn shop-btn--secondary"
              type="button"
              onClick={handleEditClick}
            >
              <i className="bi bi-pencil" aria-hidden="true"></i> Update
            </button>
            <button
              className="shop-btn shop-btn--danger"
              type="button"
              onClick={deleteProduct}
            >
              <i className="bi bi-trash3" aria-hidden="true"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;