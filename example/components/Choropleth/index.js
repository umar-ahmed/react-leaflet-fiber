import React, { useRef, useCallback } from "react";

import { statesData } from "./us-states";
import { LeafletMap } from "react-leaflet-fiber";

function getColor(d) {
  return d > 1000
    ? "#800026"
    : d > 500
    ? "#BD0026"
    : d > 200
    ? "#E31A1C"
    : d > 100
    ? "#FC4E2A"
    : d > 50
    ? "#FD8D3C"
    : d > 20
    ? "#FEB24C"
    : d > 10
    ? "#FED976"
    : "#FFEDA0";
}

function featureStyle(feature) {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

export default function Home() {
  const mapRef = useRef();
  const geojsonRef = useRef();
  const onEachFeature = useCallback(
    (feature, layer) => {
      layer.on({
        mouseover: (e) => {
          const layer = e.target;

          layer.setStyle({
            weight: 5,
            color: "#666",
            dashArray: "",
            fillOpacity: 0.7,
          });

          const L = require("leaflet");

          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
          }
        },
        mouseout: (e) => {
          geojsonRef.current.resetStyle(e.target);
        },
        click: (e) => {
          mapRef.current.fitBounds(e.target.getBounds());
        },
      });
    },
    [geojsonRef, mapRef]
  );

  return (
    <LeafletMap mapRef={mapRef} center={[37.8, -96]} zoom={4}>
      <layer-tileLayer
        args={["https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"]}
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <layer-geoJSON
        ref={geojsonRef}
        args={[statesData]}
        style={featureStyle}
        onEachFeature={onEachFeature}
      />
    </LeafletMap>
  );
}
