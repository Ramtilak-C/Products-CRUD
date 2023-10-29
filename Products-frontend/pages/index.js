import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp() {
  useEffect(() => {
    const root = ReactDOM.createRoot(document.getElementById('root'));

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }, []);

  return <div id="root"></div>;
}

export default MyApp;
