const vehicleSelectionNext = () => {
  ("Inside");
  let fields = document.getElementsByName("vehicle");
  let type;
  fields.forEach((element) => {
    if (element.checked) {
      type = element.value;
    }
  });
  if (!type) {
    document.getElementById("vehicle-type-error").style.display = "block";
  } else {
    window.location.href = `/customer/addVehicle/${type}`;
  }
};

const addVehicle = async () => {
  let vehicleData = {};
  let fields = document.querySelectorAll("*");
  fields.forEach((element) => {
    if (element.tagName == "INPUT" && element.value != "") {
      if (element.type == "file") {
        vehicleData[element.name] = element.files[0].name;
      } else {
        vehicleData[element.name] = element.value;
      }
    }
  });
  let typeId;
  let add = await fetch("/customer/addVehicle", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(vehicleData),
  });
  let response = await add.json();
  if (response.success) {
    window.location.href = `/customer/addVehicle/${vehicleData.type}`;
  } else {
    let error = document.getElementById("vehicle-error");
    error.style.display = "block";
    error.textContent = response.message;
  }
};

const changeVehicleImage = () => {
  if (document.getElementById("image-vehicle")) {
    document.getElementById("image-vehicle").remove();
  }
  let file = document.getElementById("vehicle-file");
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file.files[0]);
  fileReader.addEventListener("load", (imageData) => {
    let image = document.createElement("img");
    image.src = imageData.target.result;
    image.id = "image-vehicle";
    image.style.height = "160px";
    image.style.width = "128px";
    image.style.border = "1px solid";
    image.style.borderColor = "#152533";
    document.getElementById("vehicle-upload").style.display = "none";
    document.getElementById("vehicle-image").style.display = "block";
    document.getElementById("vehicle-image").appendChild(image);
  });
};

const selectVehicle = () => {
  let j = 0;
  let fields = document.getElementsByName("vehicle");
  for (let i = 0; i < fields.length; i++) {
    document.getElementsByName(`vehicle${i + 1}`)[0].style.border = "none";
    j++;
  }
  fields.forEach((element) => {
    document.getElementsByName(element.id)[0].style.padding = "2px";
    if (element.checked) {
      document.getElementsByName(element.id)[0].style.border =
        "2px solid green";
      document.getElementsByName(element.id)[0].style.padding = "0";
    }
  });
};

const uncheckVehicle = () => {
  let radio = document.querySelectorAll("input");
  radio.forEach((element) => {
    if (element.type == "radio") {
      element.checked = false;
    }
  });
};

uncheckVehicle();
