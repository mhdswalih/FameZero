import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import store, { persistor } from './Redux/store.ts'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const googleId = import.meta.env.VITE_GOOGLE_CLINT_ID!;

const initialOptions = {
  "clientId": import.meta.env.VITE_PAY_PAL_CLIENT_ID!,
  currency: "USD",
  intent: "capture",
};
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PayPalScriptProvider options={{
      "clientId":'AR4Rzncpd4CTWRZPWsXh1qTFdQU_8JW38waGLQbwGLrkj4F-CQF157Pdgt69Wkw_jaxVseazXuZzCVV0',
      currency: "USD",
      intent: "capture"
    }}>
      <GoogleOAuthProvider clientId={googleId}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
    </PayPalScriptProvider>
  </StrictMode>,
)