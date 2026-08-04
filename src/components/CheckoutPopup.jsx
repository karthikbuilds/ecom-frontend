import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ShopImage, Price } from './ui';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  return (
    <div className="checkoutPopup">
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Progress steps — clarifies where the shopper is in the flow */}
          <div className="shop-steps" aria-label="Checkout progress">
            <div className="shop-step shop-step--done">
              <span className="shop-step__num">
                <i className="bi bi-check-lg" aria-hidden="true"></i>
              </span>
              Cart
            </div>
            <span className="shop-step__bar" />
            <div className="shop-step shop-step--active">
              <span className="shop-step__num">2</span>
              Review
            </div>
            <span className="shop-step__bar" />
            <div className="shop-step">
              <span className="shop-step__num">3</span>
              Done
            </div>
          </div>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.id} className="shop-checkout-item">
                <ShopImage src={item.imageUrl} alt={item.name} />
                <div>
                  <p className="shop-checkout-item__name">{item.name}</p>
                  <p className="shop-checkout-item__meta">Qty: {item.quantity}</p>
                </div>
                <Price className="shop-checkout-item__price" value={item.price * item.quantity} />
              </div>
            ))}
          </div>

          <div className="shop-checkout-total">
            <span>Total</span>
            <Price className="shop-cart__total" value={totalPrice} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className="shop-btn shop-btn--secondary">
            Close
          </Button>
          <Button variant="primary" onClick={handleCheckout} className="shop-btn shop-btn--primary">
            <i className="bi bi-lock-fill" aria-hidden="true"></i> Confirm Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutPopup;
