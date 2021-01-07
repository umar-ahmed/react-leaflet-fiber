import React from 'react';
import * as ReactDOM from 'react-dom';

import { LeafletMap } from '../';

describe('LeafletMap', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LeafletMap center={[0, 0]} zoom={12} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
