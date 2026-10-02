import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('palvii_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('palvii_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.type === product.type);
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.type === product.type
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
    const alreadyInCart = items.find(i => i.id === product.id && i.type === product.type);
    toast.success(
      alreadyInCart ? `${product.name} quantity updated` : `${product.name} added to basket`,
      { id: `cart-${product.id}-${product.type}`, duration: 2000 }
    );
  };

  const removeItem = (id, type = 'product') => {
    setItems(prev => prev.filter(i => !(i.id === id && i.type === type)));
  };

  const updateQuantity = (id, type = 'product', quantity) => {
    if (quantity <= 0) {
      removeItem(id, type);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.id === id && i.type === type ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const deliveryCharge = subtotal >= 300 ? 0 : 30;
  const total = subtotal + deliveryCharge;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      subtotal, deliveryCharge, total, itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
