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

const addVehicle = async () => {
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
  let typeId = localStorage.getItem("typeId");
  vehicleData.append("vehicleImage", vehicleImage);
  vehicleData.append("type", typeId);
  let response = await callApiWithFormData({
    endpoint: "/customer/addVehicle",
    body: vehicleData,
    method: "POST",
  });
  if (response.success) {
    localStorage.setItem("vehicleId", response.vehicleId);
    setActive(screen[2]);
    document
      .querySelectorAll("input[vehicle]")
      .forEach((control) => (control.value = ""));
    toast.show("success", response.message);
  } else {
    toast.show("error", response.message);
  }
};

const addVehicleForm = () => {
  let formPlace = document.getElementById("other");
  formPlace.style.display = "flex";
  formPlace.style.zIndex = 1003;
  formPlace.innerHTML = `
                    <div class="m-10 p-4 w-full bg-white my-20 mx-auto rounded-lg text-left" id="vehicle-form"
    style="box-shadow: 1px 1px 1px  grey, inset 1px 1px rgba(1,1,1,.1);">
    <h3 class="pt-5 mx-8 text-3xl text-dark">Add new vehicle</h3>    
    <hr class=" my-3 border-2 mx-8 border-dark">
    <div class="flex">
        <div class="flex items-center w-[30%] h-[200px]">
            <label for="vehicle-file" id="vehicle-image"
                class=" mx-8 rounded hover:cursor-pointer max-w-32 max-h-56 py-11 text-center text-white hidden -mt-[29px] mr-0 mb-0"></label>
            <label for="vehicle-file" id="vehicle-upload"
                class="w-full h-full ml-8 bg-dark rounded hover:cursor-pointer flex justify-center items-center text-center text-white flex-col text-lg">
                <img
                    class="m-auto h-[50%]" alt="upload" src="/icons/upload-white.svg"></img> Click here to
                upload
                pic</label>
            <input type="file" id="vehicle-file" name="vehicleImage" onchange="changeVehicleImage()"  accept="[image/png,image/jpg,image/jpeg]" hidden />
        </div>
        <div class="w-[70%] px-10">
            <div class="flex my-2 items-center justify-between w-full">
                <label>Brand Name</label>
                <input type="text"
                  id="brand"
                    class="bg-white h-[40px] w-3/4 rounded  pl-2 border-dark placeholder:text-dark placeholder:opacity-45"
                    placeholder="Enter vehicle brand name" name="brand" vehicle="brand"
                    style="box-shadow: 1px 1px 1px  #152533, inset 1px 1px rgba(1,1,1,.3);" Validation="require multi_word" oninput="Validation.isValid(this)" />
            </div>
            <div class="flex my-2 items-center justify-between w-full">
                <label>Vehicle Model</label>
                <input type="text"
                vehicle="model"
                id="model"
                    class="bg-white h-[40px] w-3/4 rounded pl-2 placeholder:text-dark placeholder:opacity-45  text-left"
                    placeholder="Enter vehicle model" name="model"
                    style="box-shadow: 1px 1px 1px  #152533, inset 1px 1px rgba(1,1,1,.3);" Validation="require multi_word" oninput="Validation.isValid(this)"/>
            </div>

            <div class="flex my-2 items-center justify-between w-full">
                <label>Model Year</label>
                <input type="text" vehicle="year"
                  id="year"
                    class="bg-white h-[35px] w-3/4 rounded pl-2 placeholder:text-dark placeholder:opacity-45  text-left"
                    placeholder="Enter vehicle model year" name="year"
                    style="box-shadow: 1px 1px 1px  #152533, inset 1px 1px rgba(1,1,1,.3);" Validation="require year" oninput="Validation.isValid(this)" />
            </div>
            <div class="flex my-2 items-center justify-between w-full">
                <label class="w-1/4">Registered Number</label>
                <input type="text"
                id="numberPlate"
                vehicle="numberPlate"
                    class="bg-white h-[40px] w-3/4 rounded  pl-2 border-dark placeholder:text-dark placeholder:opacity-45  text-left"
                    placeholder="xx 00 xx 0000" name="numberPlate"
                    style="box-shadow: 1px 1px 1px  #152533, inset 1px 1px rgba(1,1,1,.3);" Validation="require" oninput="Validation.isValid(this)" />
            </div>
        </div>
    </div>
    <div class="mx-8 my-2 flex flex-col">

        <div class="flex flex-col my-2 w-full">
            <label>Vehicle description</label>
            <input type="text"
            vehicle="description"
              id="description"
                class="bg-white h-[200px] w- full rounded  pl-2 border-dark placeholder:text-dark placeholder:opacity-45 text-left"
                placeholder="Enter vehicle description" name="description"
                style="box-shadow: 1px 1px 1px  #152533, inset 1px 1px rgba(1,1,1,.3);" Validation="require"  oninput="Validation.isValid(this)"/>
        </div>

        <p class="hidden text-red" id="vehicle-error"></p>
        <div>
            <input type="button" value="Save"
                class="float-right text-center px-5 py-2 rounded bg-dark max-w-20 flex-end hover:cursor-pointer text-white"
                onclick="addVehicle()">
        </div>
    </div>
</div>
                    `;
};
