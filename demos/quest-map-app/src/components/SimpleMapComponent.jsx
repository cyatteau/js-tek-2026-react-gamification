import React, { useEffect, useRef } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";

const SimpleMapComponent = React.memo(({ selectedBasemap }) => {
  esriConfig.apiKey =
    "key";

  const mapDiv = useRef(null);

  useEffect(() => {
    if (!mapDiv.current) return;

    const customBasemapLayer = new VectorTileLayer({
      portalItem: {
        id: selectedBasemap,
      },
    });

    const map = new Map({
      basemap: {
        baseLayers: [customBasemapLayer],
      },
    });

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      center: [0, 0],
      zoom: 2,
    });

    return () => {
      view.destroy();
    };
  }, [selectedBasemap]);

  return <div ref={mapDiv} className="map-view" />;
});

export default SimpleMapComponent;
