import * as L from "leaflet";

export declare namespace ReactLeafletFiber {
  type Args<T> = T extends new (...args: any) => any
    ? ConstructorParameters<T>
    : T;

  export interface NodeProps<T> {
    /** Constructor arguments */
    args?: Args<T>;
    children?: React.ReactNode;
    ref?: React.Ref<React.ReactNode>;
    key?: React.Key;
  }

  export type Node<T, O> = O & NodeProps<T>;

  export type LayerNode<T extends L.Layer, O> = Node<T, O>;
  export type ControlNode<T extends L.Control, O> = Omit<
    Node<T, O>,
    "children"
  >;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Layers
      "layer-tileLayer": ReactLeafletFiber.LayerNode<
        L.TileLayer,
        L.TileLayerOptions
      >;
      "layer-geoJSON": ReactLeafletFiber.LayerNode<L.GeoJSON, L.GeoJSONOptions>;
      "layer-marker": ReactLeafletFiber.LayerNode<L.Marker, L.MarkerOptions>;
      "layer-circle": ReactLeafletFiber.LayerNode<
        L.Circle,
        L.CircleMarkerOptions
      >;
      "layer-rectangle": ReactLeafletFiber.LayerNode<
        L.Rectangle,
        L.PolylineOptions
      >;
      "layer-popup": ReactLeafletFiber.LayerNode<L.Popup, L.PopupOptions>;
      "layer-tooltip": ReactLeafletFiber.LayerNode<L.Tooltip, L.TooltipOptions>;

      // Controls
      "control-zoom": ReactLeafletFiber.ControlNode<
        L.Control.Zoom,
        L.Control.ZoomOptions
      >;
      "control-attribution": ReactLeafletFiber.ControlNode<
        L.Control.Attribution,
        L.Control.AttributionOptions
      >;
      "control-layers": ReactLeafletFiber.ControlNode<
        L.Control.Layers,
        L.Control.LayersOptions
      >;
      "control-scale": ReactLeafletFiber.ControlNode<
        L.Control.Scale,
        L.Control.ScaleOptions
      >;
    }
  }
}
