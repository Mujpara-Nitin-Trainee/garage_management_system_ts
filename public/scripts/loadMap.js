const loadMap = async (mapId) => {
  try {
    const position = [22.684282675883896, 72.88051636361853];
    const map = L.map(mapId).setView(position, 8);
    // Google layer (HTTPS URL)
    const googleStreets = L.tileLayer(
      "https://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    ).addTo(map);

    // OSM Layer
    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    // Esri Layers (HTTPS URL)
    const Esri_WorldImagery = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      }
    );

    const Esri_NatGeoWorldMap = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
        maxZoom: 16,
      }
    );

    // Google Hybrid Layer (HTTPS URL)
    const googleHybrid = L.tileLayer(
      "https://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );

    /*My Location Icon*/
    const myIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/Makwana-Bharat/pathdarshak/main/assest/Images/Location.png",
      iconSize: [50, 50],
    });

    const MyLoc = L.marker(position, { icon: myIcon, draggable: true }).addTo(
      map
    );

    MyLoc.on("dragend", function (event) {
      const position = MyLoc.getLatLng();
      document.getElementById("latitude").value = position.lat;
      document.getElementById("longitude").value = position.lng;
    });

    // Set initial values of inputs
    document.getElementById("latitude").value = position[0];
    document.getElementById("longitude").value = position[1];

    /* Layer Management*/
    const base = {
      "Google Street": googleStreets,
      OSM: osm,
      Google: Esri_WorldImagery,
      Netro: Esri_NatGeoWorldMap,
      Hybrid: googleHybrid,
    };
    const overlayMaps = {
      Marker: MyLoc,
    };
    L.control.layers(base, overlayMaps).addTo(map);
  } catch (error) {
  }
};
