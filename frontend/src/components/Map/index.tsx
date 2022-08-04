import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LocationContainerProps {
  latitude: number;
  longitude: number;
  onSelectLocation: (lat: string, lon: string) => void;
}

export default function MapComponent({
  latitude,
  longitude,
  onSelectLocation,
}: LocationContainerProps): JSX.Element {
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        onSelectLocation(String(e.latlng.lat), String(e.latlng.lng));
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return (
      <Marker position={[latitude, longitude]} icon={iconTracker}></Marker>
    );
  }

  const iconTracker = L.icon({
    iconUrl: "/marker.svg",
    iconRetinaUrl: "/marker.svg",
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(45, 55),
    className: "teste",
  });

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

  return (
    <div>
      <label>Localização</label>

      <MapContainer
        center={[latitude, longitude]}
        zoom={18}
        scrollWheelZoom
        style={{
          height: "60vh",
          width: "100%",
          zIndex: 1,
        }}
      >
        <TileLayer
          attribution='© <a href="https://www.mapbox.com/feedback/">Mapbox</a>'
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`}
          maxZoom={18}
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
