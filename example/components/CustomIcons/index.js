import React, { useState, useEffect, useRef } from "react";
import { LeafletMap } from "react-leaflet-fiber";

export default function CustomIcons() {
  const [ready, setReady] = useState(false);
  const greenIcon = useRef(null);
  const redIcon = useRef(null);
  const orangeIcon = useRef(null);

  useEffect(() => {
    const L = require("leaflet");
    const LeafIcon = L.Icon.extend({
      options: {
        shadowUrl: "leaf-shadow.png",
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      },
    });
    greenIcon.current = new LeafIcon({ iconUrl: "leaf-green.png" });
    redIcon.current = new LeafIcon({ iconUrl: "leaf-red.png" });
    orangeIcon.current = new LeafIcon({ iconUrl: "leaf-orange.png" });
  }, []);

  useEffect(() => {
    if (!greenIcon.current || !redIcon.current || !orangeIcon.current) return;
    setReady(true);
  }, [greenIcon]);

  if (!ready) {
    return <div>Loading</div>;
  }

  return (
    <LeafletMap center={[51.5, -0.09]} zoom={13}>
      <layer-tileLayer
        args={["https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"]}
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {greenIcon.current && (
        <layer-marker args={[[51.5, -0.09]]} icon={greenIcon.current}>
          <layer-popup bind="popup" content="I am a green leaf." />
        </layer-marker>
      )}
      {redIcon.current && (
        <layer-marker args={[[51.495, -0.083]]} icon={redIcon.current}>
          <layer-popup bind="popup" content="I am a red leaf." />
        </layer-marker>
      )}
      {orangeIcon.current && (
        <layer-marker args={[[51.49, -0.1]]} icon={orangeIcon.current}>
          <layer-popup bind="popup" content="I am a orange leaf." />
        </layer-marker>
      )}
    </LeafletMap>
  );
}
