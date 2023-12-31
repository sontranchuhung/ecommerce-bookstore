import React from "react";
import { Typography, Button, Divider } from "@material-ui/core";
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Review from "./Review";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({
  checkoutToken,
  nextStep,
  backStep,
  shippingData,
  onCaptureCheckout,
}) => {
  const fetchClientSecret = async () => {
    console.log("checkout token: ", checkoutToken);
    const response = await fetch('http://localhost:3010/checkout/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: checkoutToken.total.raw,
        currency: 'vnd',
      }),
    });
    const data = await response.json();
    return data.clientSecret;
  };

  const postOrderData = async (orderData, checkoutToken) => {
    try {
      const response = await fetch('http://localhost:3010/checkout/success-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData: orderData,
          checkoutToken: checkoutToken.id,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error posting order data:", error);
    }
  };

  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const clientSecret = await fetchClientSecret();
    const cardElement = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          email: shippingData.email,
        },
      },
    });

    if (result.error) {
      console.log("[error]", result.error);
      const errMsg = result.error.message + ' (' + result.error.decline_code + ')';
      console.log("Calling onCaptureCheckout with errMsg:", errMsg); // Log the error message being passed
      onCaptureCheckout(checkoutToken.id, null, errMsg);
      nextStep();
    } else {
      const errMsg = '';
      if (result.paymentIntent.status === 'succeeded') {
        // Construct order data 
        console.log("Checkout Token: ", checkoutToken);
        console.log("shippping data: ", shippingData);
        console.log("Card element: ", cardElement);
        const orderData = {
          line_items: checkoutToken.line_items,
          customer: {
            firstname: shippingData.firstName,
            lastname: shippingData.lastName,
            email: shippingData.email,
          },
          shipping: {
            name: shippingData.shippingOption,
            street: shippingData.address1,
            town_city: shippingData.city,
            county_state: shippingData.shippingSubdivision,
            postal_zip_code: shippingData.zip,
            country: shippingData.shippingCountry,
          },
          fulfillment: { shipping_method: shippingData.shippingOption },
          payment: {
            gateway: "test_gateway",
            card: {
              number: '4242 4242 4242 4242',
              expiry_month: '01',
              expiry_year: '2024',
              cvc: '123',
              postal_zip_code: '94103',
            },
          },
        };
        // Post the order data to the server
        await postOrderData(orderData, checkoutToken);

        // Capturing the checkout (add order to commercejs and fetch customer)
        onCaptureCheckout(checkoutToken.id, orderData, errMsg);
        nextStep();
      }
    }

  };

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: "20px 0" }}>
        Payment method
      </Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
              <CardElement />
              <br /> <br />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={backStep}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!stripe}
                  style={{ backgroundColor: "#001524", color: "#FFFF" }}
                >
                  Pay {checkoutToken.subtotal.formatted_with_symbol}
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;
