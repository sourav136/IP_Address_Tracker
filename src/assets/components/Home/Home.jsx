import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Home.css";
import Arrow from "../../images/icon-arrow.svg";
import customMarker from "../../images/icon-location.svg";

const customIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Home = () => {
  const [ipData, setIpData] = useState(null);
  const [inputIP, setInputIP] = useState("");
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);

  const fetchIPDetails = async (ip = "") => {
    try {
      const response = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_zwW5j7ZNt7H7LaEW5k8iNKoiYcnxk&ipAddress=${ip}`
      );
      setIpData(response.data);
      setMapPosition([response.data.location.lat, response.data.location.lng]);
    } catch (error) {
      console.error("Error fetching IP data:", error);
    }
  };

  useEffect(() => {
    fetchIPDetails();
  }, []);

  return (
    <div>
      <div className="home-banner">
        <div className="container d-flex align-items-center justify-content-center flex-column">
          <h1 className="home-h1">IP Address Tracker</h1>
          <div className="btn-group w-100 d-flex justify-content-center">
            <input
              id="ip-id"
              placeholder="Type IP Address or Domain"
              className="input-field"
              type="text"
              value={inputIP}
              onChange={(e) => setInputIP(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchIPDetails(inputIP);
                }}}
            />
            <button className="input-button" type="submit" onClick={() => fetchIPDetails(inputIP)}>
              <img src={Arrow} alt="arrow-icon" />
            </button>
          </div>

          {ipData && (
            <div className="status d-flex align-items-center">
              <div className="status-container border-holder">
                <p className="status-p">IP Address</p>
                <h2 className="status-h2">{ipData.ip}</h2>
              </div>
              <div className="status-container border-holder">
                <p className="status-p">Location</p>
                <h2 className="status-h2">
                  {ipData.location.city}, {ipData.location.country}
                </h2>
              </div>
              <div className="status-container border-holder">
                <p className="status-p">Timezone</p>
                <h2 className="status-h2">UTC {ipData.location.timezone}</h2>
              </div>
              <div className="status-container">
                <p className="status-p">ISP</p>
                <h2 className="status-h2">{ipData.isp}</h2>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      {ipData && (
        <MapContainer center={mapPosition} zoom={13} key={mapPosition.toString()} className="map-container">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={mapPosition} icon={customIcon}>
            <Popup>{ipData.location.city}, {ipData.location.country}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default Home;
