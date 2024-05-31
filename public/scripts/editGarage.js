const editGarage = async (index) => {
  await loadAddress("editGarage");
  activeSub("garage-edit");
  const garage = garages[index];
  document
    .querySelector("#editGarage")
    .setAttribute("garageId", garage.garage_id);
  document.querySelector("#editGarage #garageName").value = garage.garage_name;
  document.querySelector("#editGarage #email").value = garage.email;
  document.querySelector("#editGarage #contactNumber").value =
    garage.contact_number;
  document.querySelector("#editGarage #openTime").value =
    garage.open_time.slice(11, 16);
  document.querySelector("#editGarage #closeTime").value =
    garage.close_time.slice(11, 16);
  document.querySelector("#editGarage #description").value = garage.description;
  document.querySelector("#editGarage  img").src =
    "/uploads/" + garage.thumbnail;
  document.querySelector("#editGarage  img").classList.remove("hidden");
  const addressDetails = await callAPI(
    "/owner/garages/address/" + garage.garage_id
  );
  const address = addressDetails.address[0];
  document.querySelector("#editGarage #area").value = address.area;
  document.querySelector("#editGarage #state").value = address.stateId;
  await loadCity("editGarage");
  document.querySelector("#editGarage #cityId").value = address.cityId;
  document.querySelector("#editGarage #pincode").value = address.pincode;
  document.querySelector("#editGarage #latitude").value = address.latitude;
  document.querySelector("#editGarage #longitude").value = address.longitude;
};
