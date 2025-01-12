import React, { useState, useEffect } from "react";
import { CssBaseline } from "@material-ui/core";
import { commerce } from "./lib/commerce";
import Products from "./components/Products/Products";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/CheckoutForm/Checkout/Checkout";
import ProductView from "./components/ProductView/ProductView";
import Manga from "./components/Manga/Manga";
import Footer from "./components/Footer/Footer";
import NotFound from "./NotFound"
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import RestoreAccount from "./components/Auth/restoreAccount";
import VerifyAccount from "./components/Auth/verifyAccount";
import ResetPassword from "./components/Auth/resetPassword"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import loadingImg from "./assets/loader.gif";
import "./style.css";
import Fiction from "./components/Fiction/Fiction";
import Biography from "./components/Bio/Biography";

const App = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [mangaProducts, setMangaProducts] = useState([]);
  const [fictionProducts, setFictionProducts] = useState([]);
  const [bioProducts, setBioProducts] = useState([]);
  const [featureProducts, setFeatureProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  const fetchMangaProducts = async () => {
    const { data } = await commerce.products.list({
      category_slug: ["manga"],
    });

    setMangaProducts(data);
  };

  const fetchFeatureProducts = async () => {
    const { data } = await commerce.products.list({
      category_slug: ["featured"],
    });

    setFeatureProducts(data);
  };

  const fetchFictionProducts = async () => {
    const { data } = await commerce.products.list({
      category_slug: ["fiction"],
    });

    setFictionProducts(data);
  };

  const fetchBioProducts = async () => {
    const { data } = await commerce.products.list({
      category_slug: ["biography"],
    });

    setBioProducts(data);
  };

  const fetchCart = async () => {
    console.log("Fetching cart...");
    const retrievedCart = await commerce.cart.retrieve();
    console.log("Retrieved cart:", retrievedCart);
    setCart(retrievedCart);
  };

  const handleAddToCart = async (productId, quantity) => {
    console.log(`Adding ${quantity} of product ${productId} to the cart...`);
    const item = await commerce.cart.add(productId, quantity);
    console.log("Added item to cart:", item);

    console.log("Total items: ", item)
    setCart(item);
  };

  const handleUpdateCartQty = async (lineItemId, quantity) => {
    console.log(`Updating quantity of item ${lineItemId} to ${quantity}...`);
    const response = await commerce.cart.update(lineItemId, { quantity });
    console.log("Updated cart:", response);
    setCart(response);
  };

  const handleRemoveFromCart = async (lineItemId) => {
    const response = await commerce.cart.remove(lineItemId);
    console.log("Removed item from cart. New cart:", response);
    setCart(response);
  };

  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();
    console.log("Emptied cart. New cart:", response);
    setCart(response);
  };


  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };


  const handleCaptureCheckout = async (checkoutTokenId, newOrder, errMsg) => {
    try {
      console.log("handleCaptureCheckout called with errMsg:", errMsg); // Check the error message received
      if (errMsg === "") {
        const incomingOrder = await commerce.checkout.capture(
          checkoutTokenId,
          newOrder
        );
        setOrder(incomingOrder);
        refreshCart();
      } else {
        throw new Error(errMsg);
      }
    } catch (error) {
      console.log("Setting error message:", error.message); // Log the error being set
      setErrorMessage(error.message);
    }
  };
  
  
  

  useEffect(() => {
    fetchProducts();
    fetchFeatureProducts();
    fetchCart();
    fetchMangaProducts();
    fetchFictionProducts();
    fetchBioProducts();
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <div>
      {products.length > 0 ? (
        <>
          <Router>
            <div style={{ display: "flex" }}>
              <CssBaseline />
              {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/forgot-password' && location.pathname !== '/verify-account' && location.pathname !== '/reset-password' && (
                <Navbar
                  totalItems={cart.total_items}
                  handleDrawerToggle={handleDrawerToggle}
                  isLoggedIn={isLoggedIn}
                  onLogout={handleLogout}
                />
              )}
              <Switch>
                <Route exact path="/">
                  <Products
                    products={products}
                    featureProducts={featureProducts}
                    onAddToCart={handleAddToCart}
                    handleUpdateCartQty
                  />
                </Route>
                <Route path='/login'>
                  <Login
                    onLoginSuccess={handleLoginSuccess}
                    totalItems={cart.total_items}
                  />
                </Route>
                <Route path='/register'>
                  <Register />
                </Route>
                <Route path='/forgot-password'>
                  <RestoreAccount />
                </Route>
                <Route path="/verify-account">
                  <VerifyAccount />
                </Route>
                <Route path="/reset-password">
                  <ResetPassword />
                </Route>
                <Route exact path="/cart">
                  <Cart
                    cart={cart}
                    onUpdateCartQty={handleUpdateCartQty}
                    onRemoveFromCart={handleRemoveFromCart}
                    onEmptyCart={handleEmptyCart}
                  />
                </Route>
                <Route path="/checkout" exact>
                  <Checkout
                    cart={cart}
                    order={order}
                    onCaptureCheckout={handleCaptureCheckout}
                    error={errorMessage}
                    isLoggedIn={isLoggedIn}
                  />
                </Route>
                <Route path="/product-view/:id" exact>
                  <ProductView />
                </Route>
                <Route path="/manga" exact>
                  <Manga
                    mangaProducts={mangaProducts}
                    onAddToCart={handleAddToCart}
                    handleUpdateCartQty
                  />
                </Route>
                <Route path="/fiction" exact>
                  <Fiction
                    fictionProducts={fictionProducts}
                    onAddToCart={handleAddToCart}
                    handleUpdateCartQty
                  />
                </Route>
                <Route path="/biography" exact>
                  <Biography
                    bioProducts={bioProducts}
                    onAddToCart={handleAddToCart}
                    handleUpdateCartQty
                  />
                </Route>
                <Route path="*">
                  <NotFound />
                </Route>
              </Switch>
            </div>
          </Router>
          {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/forgot-password' && location.pathname !== '/verify-account' && location.pathname !== '/reset-password' && (
            <Footer />
          )}
        </>
      ) : (
        <div className="loader">
          <img src={loadingImg} alt="Loading" />
        </div>

      )}
    </div>
  );
};

export default App;
