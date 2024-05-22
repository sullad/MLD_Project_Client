import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './app/store';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
    {/* <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    /> */}
  </Provider>,
);
