import * as React from 'react';
import * as L from 'leaflet';

import { render, unmountComponentAtNode } from './renderer';
import { LeafletProvider } from './context';

export interface LeafletMapProps {
  center: L.LatLngExpression;
  zoom: number;
  children?: React.ReactChildren;
  onClick?: L.LeafletMouseEventHandlerFn;
  onMouseMove?: L.LeafletMouseEventHandlerFn;
  mapRef?: any;
  className?: string;
  id?: string;
  style?: object;
  [x: string]: any;
}

export function LeafletMap({
  center = [0, 0],
  zoom = 15,
  children,
  onClick = () => {},
  onMouseMove = () => {},
  mapRef = null,
  ...props
}: LeafletMapProps) {
  const domRef = React.useRef<any>();
  const map = React.useRef<L.Map>();

  React.useEffect(() => {
    if (!domRef.current) return;

    if (!map.current) {
      map.current = L.map(domRef.current).setView(center, zoom);
    }

    if (mapRef) {
      mapRef.current = map.current;
    }

    render(
      <LeafletProvider value={{ map: map.current }}>
        {children}
      </LeafletProvider>,
      map.current
    );

    return () => {
      if (!map.current) return;
      unmountComponentAtNode(map.current);
      map.current.remove();
    };
  }, [children]);

  React.useEffect(() => {
    if (!map.current) return;
    map.current.on('click', onClick);

    return () => {
      if (!map.current) return;
      map.current.off('click', onClick);
    };
  }, [onClick]);

  React.useEffect(() => {
    if (!map.current) return;
    map.current.on('mousemove', onMouseMove);

    return () => {
      if (!map.current) return;
      map.current.off('mousemove', onMouseMove);
    };
  }, [onMouseMove]);

  return <div ref={domRef} style={{ height: '400px' }} {...props} />;
}
