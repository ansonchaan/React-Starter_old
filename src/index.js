import React from 'react';
import {render, hydrate} from 'react-dom';
import { Provider } from "react-redux";
import Loadable from 'react-loadable';
// import { Frontload } from 'react-frontload';
import { BrowserRouter, Route } from 'react-router-dom';
// import { ConnectedRouter } from 'connected-react-router';
import createStore from "./store";
import App from './App';



const { store } = createStore();

const Application = (
    <Provider store={store}>
        <BrowserRouter>
            {/* <Frontload noServerRender> */}
                <Route render={props => <App {...props} />} />
            {/* </Frontload> */}
        </BrowserRouter>
    </Provider>
);


// Render
const root = document.querySelector('#root');

if (process.env.NODE_ENV === 'production') {
  // If we're running in production, we use hydrate to get fast page loads by just
  // attaching event listeners after the initial render
  Loadable.preloadReady().then(() => {
    hydrate(Application, root);
  });
} else {
  // If we're not running on the server, just render like normal
  render(Application, root);
}