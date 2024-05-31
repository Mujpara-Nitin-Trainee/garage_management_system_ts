const changeStep = (form, hide, show) => {
  const openTime = document.querySelector(`#${form} #openTime`);
  const closeTime = document.querySelector(`#${form} #closeTime`);
  document.querySelectorAll("error").forEach((er) => er.remove());
  document
    .querySelectorAll(
      `#${form} #${hide} input[Validation],#${form} #${hide} select[Validation],#${form} #${hide} textarea[Validation]`
    )
    .forEach((ele) => {
      Validation.isValid(ele);
    });
  const diff = (new Date("1970-1-1 " + closeTime.value) - new Date("1970-1-1 " + openTime.value)) / 1000 / 60 / 60;
  if (diff < 1) {
    let errorElement = document.createElement("error");
    errorElement.innerText = 'close time must be 1hr greater than opentime';
    closeTime.insertAdjacentElement("afterend", errorElement);
  }
  if (!document.querySelectorAll("error").length) {
    document.querySelector(`#${form} #${hide}`).classList.add("hidden");
    document.querySelector(`#${form} #${show}`).classList.remove("hidden");
  }
};

const updateGarage = async () => {
  let formData = document.getElementById("garageAdd");
  let details = new FormData(formData);
  const params = new URLSearchParams(details);
  const garageData = await new Response(params).text();
  let data = await fetch("/owner/garage/update", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: garageData,
  });
  let result = await data.json();
  document.getElementById("message").innerText = result.message;
};

///////////////////

const handleGarage = async (e) => {
  e.preventDefault();
  document
    .querySelectorAll(
      `input[Validation],select[Validation],textarea[Validation]`
    )
    .forEach((ele) => {
      Validation.isValid(ele);
    });
  if (!document.querySelectorAll(`#${e.target.id} error`).length) {
    const formData = new FormData(e.target);
    formData.delete("state");
    formData.append(
      "thumbnail",
      document.getElementById(`${e.target.id}-thumbnail`).files[0] || ""
    );
    formData.delete(`${e.target.id}-thumbnail`);
    if (e.target.id == "editGarage")
      formData.append("garageId", e.target.getAttribute("garageId"));
    else formData.append("userId", localStorage.getItem("userId"));

    //call api
    let response = { success: false };
    try {
      response = await callApiWithFormData(
        e.target.id == "addGarage"
          ? { endpoint: `/owner/garages/add`, body: formData }
          : {
            endpoint: `/owner/garages/update`,
            body: formData,
            method: "PUT",
          }
      );
    } catch (error) {
      response = error;
    } finally {
      //show response
      toast.show(response.success ? "success" : "error", response.message);
      if (response.success)
        setTimeout(() => {
          location.href = "/owner/garages";
        }, 3000);
    }
  }
};

const editGarage = async (index) => {
  loadMap("editGarage-map");
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
