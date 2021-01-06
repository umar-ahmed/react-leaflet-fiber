import * as React from "react";
import * as L from "leaflet";

export interface LeafletContext {
  map?: L.Map;
}

export const leafletContext = React.createContext<LeafletContext>({});

export const LeafletConsumer = leafletContext.Consumer;
export const LeafletProvider = leafletContext.Provider;
