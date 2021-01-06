import React from "react";
import { LeafletMap } from "react-leaflet-fiber";

import { bicycleRental, campus } from "./sample-geojson";

function onEachFeature(feature, layer) {
  var popupContent =
    "<p>I started out as a GeoJSON " +
    feature.geometry.type +
    ", but now I'm a Leaflet vector!</p>";

  if (feature.properties?.popupContent) {
    popupContent += feature.properties.popupContent;
  }

  layer.bindPopup(popupContent);
}

function pointToLayer(feature, latlng) {
  const L = require("leaflet");
  return L.circleMarker(latlng, {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  });
}

export default function GeoJSON() {
  return (
    <LeafletMap center={[39.74739, -105]} zoom={13}>
      <layer-tileLayer
        args={["https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"]}
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <layer-geoJSON
        args={[[bicycleRental, campus]]}
        style={(feature) => feature.properties?.style}
        onEachFeature={onEachFeature}
        pointToLayer={pointToLayer}
      />
    </LeafletMap>
  );
}
