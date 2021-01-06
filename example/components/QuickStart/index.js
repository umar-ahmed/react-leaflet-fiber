import React, { useState } from "react";
import { LeafletMap } from "react-leaflet-fiber";

const MAPBOX_API_TOKEN = "your.mapbox.access.token";

export default function QuickStart() {
  const [latlng, setLatlng] = useState(null);

  return (
    <LeafletMap
      center={[51.505, -0.09]}
      zoom={13}
      onClick={(e) => setLatlng(e.latlng)}
    >
      <layer-tileLayer
        args={[
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        ]}
        attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>"
        maxZoom={18}
        id="mapbox/streets-v11"
        tileSize={512}
        zoomOffset={-1}
        accessToken={MAPBOX_API_TOKEN}
      />
      <layer-marker args={[[51.5, -0.09]]}>
        <layer-popup
          bind="popup"
          content="<b>Hello world!</b><br>I am a popup."
        />
      </layer-marker>
      <layer-circle
        args={[[51.508, -0.11]]}
        color="red"
        fillColor="#f03"
        fillOpacity={0.5}
        radius={500}
      >
        <layer-popup bind="popup" content="I am a circle." />
      </layer-circle>
      <layer-polygon
        args={[
          [
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047],
          ],
        ]}
      >
        <layer-popup bind="popup" content="I am a polygon." />
      </layer-polygon>
      {latlng && (
        <React.Fragment key={latlng.toString()}>
          <layer-popup latLng={latlng} content={latlng.toString()} />
        </React.Fragment>
      )}
    </LeafletMap>
  );
}
