import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import store, { persistor } from './Redux/store.ts'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { NotificationProvider } from './Notifications/NotificationListner.tsx'

const googleId = import.meta.env.VITE_GOOGLE_CLINT_ID!;

const initialOptions = {
  "clientId": import.meta.env.VITE_PAY_PAL_CLIENT_ID!,
  currency: "USD",
  intent: "capture",
};
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PayPalScriptProvider options={initialOptions}>
      <GoogleOAuthProvider clientId={googleId}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
    <NotificationProvider>
            <App />
    </NotificationProvider>
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
    </PayPalScriptProvider>
  </StrictMode>,
)