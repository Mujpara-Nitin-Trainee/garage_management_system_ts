const showUserVehicles = async () => {
  document.getElementById("user-vehicles").classList.remove("hidden");
  document.getElementById("user-vehicles").classList.add("flex");
  document.getElementById("user-profile").classList.remove("flex");
  document.getElementById("user-profile").classList.add("hidden");
  document.getElementById("user-appointments").classList.remove("flex");
  document.getElementById("user-appointments").classList.add("hidden");
  document.getElementById("btn-full").classList.remove("opacity-100");
  document.getElementById("btn-full").classList.add("opacity-50");
  document.getElementById("btn-double").classList.remove("opacity-50");
  document.getElementById("btn-double").classList.add("opacity-100");
  document.getElementById("btn-half").classList.remove("opacity-100");
  document.getElementById("btn-half").classList.add("opacity-50");

  let appointmentRequest = await callAPI(`/customer/viewVehicles`);
  let userVehicles = ``;
  let index = 0;
  appointmentRequest.result.forEach((element) => {
    userVehicles += `
  <div class="w-[calc(100%/3)] px-5 mt-5 relative">
      <div class="absolute top-0 right-1 flex items-center mr-4 mt-4 bg-dark rounded-full"
          onmouseover="showEditBox(${index + 1})" onmouseout="hideEditBox(${
      index + 1
    })">
          <button type="button" class="h-full w-full" }>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" style="fill:white;transform: ;msFilter:;">
                  <path d="M10   10h4v4h-4zm0-6h4v4h-4zm0 12h4v4h-4z"></path>
              </svg>
          </button>
      </div>
      <div class="absolute top-3 right-5 z-10 items-center mr-4 mt-4 hidden" id="editBox${
        index + 1
      }" onmouseover="showEditBox(${index + 1})" onmouseout="hideEditBox(${
      index + 1
    })">
          <div class="bg-light p-3 rounded-xl text-left">
              <p class="flex hover:cursor-pointer"
                  onClick="editVehicle(${
                    element.id
                  })"><img src="/icons/edit.svg"
                      class="h-4 mt-1 mr-2">Edit</img></p>
          </div>
      </div>
      <div class="bg-dark text-white border-2 border-[silver]">
        <div class="flex border-2">
          <div class="w-[35%] py-3">
            <img
              src="/uploads/${element.condition_image}"
              class="h-[120px] w-[120px] bg-cover mx-auto border-2 rounded-md"
            />
          </div>
        <div class="my-auto">
         <p>
            Number Plate:<span class="ml-2 text-[silver]">
              ${element.register_plate_number}</span
            >
          </p>
          <p class="mt-3">
            Brand:
            <span class="text-lg ml-2 text-[silver]">
              ${element.brand}</span
            >
          </p>
          <p class="mt-3">
            Model: <span class="text-lg ml-2 text-[silver]"> ${
              element.model
            } </span>
          </p>
        </div>
      </div> </div>`;
    index++;
  });
  document.getElementById("vehicle-card").innerHTML = userVehicles;
};

const editVehicle = async (id) => {
  let userVehicleDetails = await callAPI(`/customer/fetchVehicleDetails/${id}`);
  let userData = userVehicleDetails.result[0];
  let userVehicles = `
  <input type="button" value="Back"
          class="bg-dark text-white cursor-pointer text-xl mb-1.5 mt-0.5  p-1.5 font-bold rounded-md"
          onclick="showUserVehicles()">
<div class="m-10 p-4 w-full bg-white my-20 mx-auto rounded-lg text-left"
    id="vehicle-form"
    style="box-shadow: 1px 1px 1px  grey, inset 1px 1px rgba(1,1,1,.1);">
    <h3 class="pt-5 mx-8 text-3xl text-dark">Add new vehicle</h3>
    <hr class=" my-3 border-2 mx-8 border-dark">
    <div class="flex">
        <div class="flex items-center w-[30%] h-[200px]">
            <label for="vehicle-file" id="vehicle-image"
                class=" mx-8 rounded hover:cursor-pointer max-w-32 max-h-56 py-11 text-center text-white hidden -mt-[29px] mr-0 mb-0"></label>
            <label for="vehicle-file" id="vehicle-upload"
                class="w-full h-full ml-8 bg-dark rounded hover:cursor-pointer flex justify-center items-center text-center text-white flex-col text-lg">
                <img class="m-auto h-[50%]" alt="upload"
                    src="/icons/upload-white.svg"></img> Click here to
                upload
                pic</label>
            <input type="file" id="vehicle-file" name="vehicleImage" accept="image/*"
                onchange="changeVehicleImage()" Validation="require" oninput="Validation.isValid(this)" hidden />
        </div>
        <div class="w-[70%] px-10">
            <div class="flex my-2 items-center justify-between w-full">
                <label>Brand Name</label>
                <input type="text" id="brand"
                    class="bg-white h-[40px] w-3/4 rounded  pl-2 border-dark placeholder:text-dark placeholder:opacity-45"
                    placeholder="Enter vehicle brand name" name="brand"
                    vehicle="brand"
                    style="box-shadow: 1px 1px 1px  #152533, inset 1px 1px rgba(1,1,1,.3);"
                    Validation="require multi_word"
                    oninput="Validation.isValid(this)"
                    value = "${userData.brand}" />
            </div>
            <div class="flex my-2 items-center justify-between w-full">
                <label>Vehicle Model</label>
                <input type="text" vehicle="model" id="model"
                    class="bg-white h-[40px] w-3/4 rounded pl-2 placeholder:text-dark placeholder:opacity-45  text-left"
                    placeholder="Enter vehicle model" name="model"
                    style="box-shadow: 1px 1px 1px  #152533, inset 1px 1px rgba(1,1,1,.3);"
                    Validation="require multi_word"
                    oninput="Validation.isValid(this)"
                    value = "${userData.model}"  />
            </div>
            <div class="flex my-2 items-center justify-between w-full">
                <label>Model Year</label>
                <input type="text" vehicle="year" id="year"
                    class="bg-white h-[35px] w-3/4 rounded pl-2 placeholder:text-dark placeholder:opacity-45  text-left"
                    placeholder="Enter vehicle model year" name="year"
                    style="box-shadow: 1px 1px 1px  #152533, inset 1px 1px rgba(1,1,1,.3);"
                    Validation="require year"
                    oninput="Validation.isValid(this)"
                    value = "${userData.year}"   />
            </div>
            <div class="flex my-2 items-center justify-between w-full">
                <label class="w-1/4">Registered Number</label>
                <input type="text" id="numberPlate" vehicle="numberPlate"
                    class="bg-white h-[40px] w-3/4 rounded  pl-2 border-dark placeholder:text-dark placeholder:opacity-45  text-left"
                    placeholder="xx 00 xx 0000" name="numberPlate"
                    style="box-shadow: 1px 1px 1px  #152533, inset 1px 1px rgba(1,1,1,.3);"
                    Validation="require" oninput="Validation.isValid(this)"
                    value = "${userData.register_plate_number}"  />
            </div>
        </div>
    </div>
    <div class="mx-8 my-2 flex flex-col">
        <div class="flex flex-col my-2 w-full">
            <label>Vehicle description</label>
            <input type="text" vehicle="description" id="description"
                class="bg-white h-[200px] w- full rounded  pl-2 border-dark placeholder:text-dark placeholder:opacity-45 text-left"
                placeholder="Enter vehicle description" name="description"
                style="box-shadow: 1px 1px 1px  #152533, inset 1px 1px rgba(1,1,1,.3);"
                Validation="require" oninput="Validation.isValid(this)"
                value = "${userData.description}"  />
        </div>
        <p class="hidden text-red" id="vehicle-error"></p>
        <div>
            <input type="button" value="Save"
                class="float-right text-center px-5 py-2 rounded bg-dark max-w-20 flex-end hover:cursor-pointer text-white"
                onclick="updateVehicle(${userData.id})">
        </div>
    </div>
</div>
 `;
  document.getElementById("vehicle-card").innerHTML = userVehicles;
};

const showEditBox = (id) => {
  document.getElementById(`editBox${id}`).style.display = "flex";
};

const hideEditBox = (id) => {
  document.getElementById(`editBox${id}`).style.display = "none";
};

const updateVehicle = async (id) => {
  let vehicleData = new FormData();
  let field = document.querySelectorAll("input[vehicle]").forEach((control) => {
    vehicleData.append(control.id, control.value);
  });
  document.querySelectorAll(`input[validation]`).forEach((ele) => {
    Validation.isValid(ele);
  });
  if (document.querySelector("error")) {
    return;
  }
  let vehicleImage = document.getElementById("vehicle-file").files[0];
  vehicleData.append("vehicleImage", vehicleImage);
  vehicleData.append("id", id);
  let response = await callApiWithFormData({
    endpoint: "/customer/updateVehicle",
    body: vehicleData,
    method: "POST",
  });
  if (response.success) {
    toast.show("success", response.message);
    setTimeout(() => {
      showUserVehicles();
    }, 2000);
  } else {
    toast.show("error", response.message);
  }
};
