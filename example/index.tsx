import 'leaflet/dist/leaflet.css';
import 'react-app-polyfill/ie11';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Example } from './components/Example';
import QuickStart from './components/QuickStart';
import GeoJSON from './components/GeoJSON';
import CustomIcons from './components/CustomIcons';
import Choropleth from './components/Choropleth';

function App() {
  return (
    <div>
      <h1>Leaflet.js Tutorial Examples</h1>
      <p>
        This page shows some re-implementations of the examples from the{' '}
        <a href="https://leafletjs.com/examples.html">Tutorials page</a> on the
        Leaflet.js website in <code>react-leaflet-fiber</code>.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gridGap: '10px',
        }}
      >
        <Example
          name="Leaflet Quick Start Guide"
          href="https://leafletjs.com/examples/quick-start/"
          sourceHref="https://github.com/umar-ahmed/world-web/tree/develop/packages/react-leaflet-fiber/examples/leaflet-tutorials/components/QuickStart"
        >
          <QuickStart />
        </Example>
        <Example
          name="Markers with Custom Icons"
          href="https://leafletjs.com/examples/custom-icons/"
          sourceHref="https://github.com/umar-ahmed/world-web/tree/develop/packages/react-leaflet-fiber/examples/leaflet-tutorials/components/CustomIcons"
        >
          <CustomIcons />
        </Example>
        <Example
          name="Using GeoJSON with Leaflet"
          href="https://leafletjs.com/examples/geojson/"
          sourceHref="https://github.com/umar-ahmed/world-web/tree/develop/packages/react-leaflet-fiber/examples/leaflet-tutorials/components/GeoJSON"
        >
          <GeoJSON />
        </Example>
        <Example
          name="Interactive Choropleth Map"
          href="https://leafletjs.com/examples/choropleth/"
          sourceHref="https://github.com/umar-ahmed/world-web/tree/develop/packages/react-leaflet-fiber/examples/leaflet-tutorials/components/Choropleth"
        >
          <Choropleth />
        </Example>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
