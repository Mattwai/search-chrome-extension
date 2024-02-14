import React from 'react';
import { createRoot } from 'react-dom';
import { Provider } from './AppContext';
import Newtab from './Newtab';
import './index.css';

const container = document.getElementById('app-container');
const root = createRoot(container);

root.render(
  <Provider>
    <Newtab />
  </Provider>
);