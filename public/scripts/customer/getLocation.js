const getUserLocation = async () => {
  let location = await new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        resolve([position.coords.latitude, position.coords.longitude]);
      });
    } else {
      let latitude = 22.684282675883896;
      let longitude = 72.88051636361853;
      toast("error", "Geolocation is not supported by this browser.");
      reject([latitude, longitude]);
    }
  });
  return location;
};
