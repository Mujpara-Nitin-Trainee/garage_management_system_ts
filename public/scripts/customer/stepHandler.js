const home = () => {
  location.href = "/";
  localStorage.clear();
};
class validateStore {
  static garage() {
    return true;
  }
  static type() {
    validateStore.garage();
    let id = localStorage.getItem("garageId");
    if (isNaN(parseInt(id))) {
      setActive(screen[0]);
      return false;
    } else return true;
  }
  static vehicle() {
    validateStore.type();
    let id = localStorage.getItem("typeId");
    if (isNaN(parseInt(id))) {
      localStorage.setItem("index", 1);
      setActive(screen[1]);
      return false;
    } else return true;
  }
  static service() {
    validateStore.vehicle();
    let id = localStorage.getItem("vehicleId");
    if (isNaN(parseInt(id))) {
      localStorage.setItem("index", 2);
      setActive(screen[2]);
      return false;
    } else return true;
  }
  static slots() {
    validateStore.service();
    let id = localStorage.getItem("serviceId");
    if (isNaN(parseInt(id))) {
      localStorage.setItem("index", 3);
      setActive(screen[3]);
      return false;
    } else return true;
  }
  static payment() {
    validateStore.slots();
    let id = localStorage.getItem("slotId");
    if (isNaN(parseInt(id))) {
      localStorage.setItem("index", 4);
      setActive(screen[4]);
      return false;
    } else return true;
  }
  static profile() {
    localStorage.clear();
    return true;
  }
}
class storeHandler {
  static store(id, value) {
    localStorage.setItem(id, value);
  }
  static garageSelection() {
    let id = document.querySelector("input[name=garage]:checked")?.value;
    storeHandler.store("garageId", id);
  }
  static vehicleTypeSelection() {
    if (!validateStore.garage() || localStorage.getItem("index") != "1") {
      localStorage.clear();
      return;
    }
    let id = document.querySelector("input[name=type]:checked")?.value;
    storeHandler.store("typeId", id);
  }
  static vehicleSelection() {
    if (!validateStore.type()) {
      localStorage.clear();
      return;
    }
    let id = document.querySelector("input[name=vehicle]:checked")?.value;
    storeHandler.store("vehicleId", id);
  }
  static serviceSelection() {
    if (!validateStore.vehicle()) {
      localStorage.clear();
      return;
    }
    let selectedServices = [];
    document
      .querySelectorAll("input[name=service]:checked")
      .forEach((service) => {
        selectedServices.push(service.id);
      });
    storeHandler.store("serviceId", selectedServices);
  }
  static slotSelection() {
    if (!validateStore.service()) {
      localStorage.clear();
      return;
    }
    let id = document.querySelector("input[name=slots]:checked")?.value;
    storeHandler.store("slotId", id);
  }
  static paymentSelection() {
    if (!validateStore.slots()) {
      localStorage.clear();
      return;
    }
    let id = document.querySelector("input[name=payment]:checked")?.value;
    storeHandler.store("paymentId", id);
  }
}
class APICaller {
  static paths = {
    garage: "/customer/garageList",
    type: "/customer/vehicleType",
    vehicle: "/customer/viewVehicle",
    service: "/customer/servicesList",
    slots: "/customer/getslots",
  };
  static async callAPIHandler(step, params = "") {
    try {
      return await callAPI(APICaller.paths[step] + `${params}`);
    } catch (error) {
      toast.show("error", error);
    }
  }
}
class htmlHandler {
  static async getData(
    step,
    stepTitle,
    params,
    errorMessage,
    container,
    eventListenter
  ) {
    if (!validateStore[step]() || step == "garage") {
      return;
    }
    let data = await APICaller.callAPIHandler(step, params);
    let html = htmlHandler.fillHtml(data, errorMessage, step, stepTitle);
    document.getElementById(`${container}-container`).innerHTML = html;
    document
      .querySelector(`input[name=${step}]`)
      ?.setAttribute("checked", true);
    storeHandler[eventListenter]();
    document.querySelectorAll(`input[name=${step}]`).forEach((control) => {
      control.addEventListener("change", storeHandler[eventListenter]);
    });
  }
  static fillHtml(data, message, stepHTML, Title) {
    let html = `
    <div class="h-full w-full p-3">
        <strong class="text-white text-left">${Title}</strong><hr/>
        <div class="max-h-[95%] h-max w-full overflow-scroll flex  ${
          stepHTML == "type" ? "flex-row flex-wrap" : "flex-col"
        } ">
    `;
    if (!data.result.length) {
      html += htmlHandler.emptyHandler(message);
    } else {
      html += htmlHandler[stepHTML](data.result);
    }
    html += "</div></div>";
    return html;
  }
  static emptyHandler(message) {
    return `
    <div class="w-full h-[80vh] flex justify-center items-center flex-col">
        <svg class="fill-[#ef4444]" width="100px" height="100px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M520.741 163.801a10.234 10.234 0 00-3.406-3.406c-4.827-2.946-11.129-1.421-14.075 3.406L80.258 856.874a10.236 10.236 0 00-1.499 5.335c0 5.655 4.585 10.24 10.24 10.24h846.004c1.882 0 3.728-.519 5.335-1.499 4.827-2.946 6.352-9.248 3.406-14.075L520.742 163.802zm43.703-26.674L987.446 830.2c17.678 28.964 8.528 66.774-20.436 84.452a61.445 61.445 0 01-32.008 8.996H88.998c-33.932 0-61.44-27.508-61.44-61.44a61.445 61.445 0 018.996-32.008l423.002-693.073c17.678-28.964 55.488-38.113 84.452-20.436a61.438 61.438 0 0120.436 20.436zM512 778.24c22.622 0 40.96-18.338 40.96-40.96s-18.338-40.96-40.96-40.96-40.96 18.338-40.96 40.96 18.338 40.96 40.96 40.96zm0-440.32c-22.622 0-40.96 18.338-40.96 40.96v225.28c0 22.622 18.338 40.96 40.96 40.96s40.96-18.338 40.96-40.96V378.88c0-22.622-18.338-40.96-40.96-40.96z"/></svg>
        <h2 class="text-[#ef4444] font-bold text-2xl">Oops..!!</h2><p class="text-[#ef4444]"><b> ${message}</b></p>
    </div>`;
  }
  static garage(garageData) {
    let garageList = ``;
    garageData.forEach((data) => {
      let address = data.area + "," + data.city_name + "," + data.state_name;
      address =
        address.length > 50 ? address.substring(0, 50) + "..." : address;
      garageList += `
                        <input type='radio' id='garage-${
                          data.id
                        }' name='garage' value='${data.id}'/>
                        <label for="garage-${data.id}" class="cursor-pointer">
                        <div class="relative bg-[rgba(0,0,0,.2)] p-2 w-full h-[100px] mt-5 rounded-lg flex" style="box-shadow:1px 1px 1px rgba(0,0,0,.2),inset 1px 1px 1px rgba(255,255,255,.2)">
                      <div class="absolute top-0.5 right-0.5 bg-yellow-600 flex rounded-md px-1 justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1); stroke:white; stroke-width: 1.7px;"><path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path></svg>
                        <span class="text-[12px] text-white text-semibold mx-0.5">${
                          data.rating
                        }</span>
                        </div>
                            <div class="garage-icon border-2 w-2/4 rounded-md overflow-hidden">
                          <img src="/uploads/${
                            data.thumbnail
                          }" onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeUyb754vebKqfbxScXd11wIOQGyxRlNNQBv31JG4wC9ytLmJgMP3i__68EPQpIN3vrPk&usqp=CAU'" class="h-full w-full bg-cover rounded-md" alt="garage">
                      </div>
                      <div class="garage-info w-3/4 p-2">
                          <h3 class="font-medium text-[14px] text-left text-white wrap-none" id="garageName">${
                            data.garage_name.length > 15
                              ? data.garage_name.substring(0, 12) + ".."
                              : data.garage_name
                          }</h3>
                          <div class="flex pt-2">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" style="fill:rgba(255,255,255,.6);"><path d="M11.42 21.815a1.004 1.004 0 0 0 1.16 0C12.884 21.598 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.996c-.029 6.444 7.116 11.602 7.42 11.819zM12 4c3.309 0 6 2.691 6 6.004.021 4.438-4.388 8.423-6 9.731-1.611-1.308-6.021-5.293-6-9.735 0-3.309 2.691-6 6-6z"></path><path d="M11 14h2v-3h3V9h-3V6h-2v3H8v2h3z"></path></svg>
                              <p class="pl-2 text-xs break-all text-[rgba(255,255,255,.6)] ">${address}</p>
                          </div>
                          
                      </div>
                  </div></label>
                  `;
    });
    return garageList;
  }
  static type(typeData) {
    let vehicleList = "";
    typeData.forEach((type) => {
      vehicleList += `
        <input type="radio" class="type hidden" id="type-${
          type.id
        }" name="type" value="${type.id}"/>
        <label for="type-${type.id}" class="w-1/3 h-[100px] p-2 " >
            <div class="h-full w-full rounded-md overflow-hidden cursor-pointer">
                <div class="bg-[rgba(0,0,0,.2)] w-full h-full flex flex-col justify-center items-center p-3 rounded-md" style="box-shadow:1px 1px 1px rgba(0,0,0,.2),inset 1px 1px 1px rgba(255,255,255,.2)">
                    <img class="h-[80%] w-full" src='/icons/vehicleType/${type.name.toLowerCase()}.svg' style="-webkit-filter: grayscale(1) invert(1);filter: grayscale(1) invert(1);" />
                    <p class="text-white font-semibold">${type.name}</p>
                </div>
        </div></label>
                        `;
    });
    return vehicleList;
  }
  static vehicle(vehicleData) {
    let vehicleHTML = "";
    vehicleData.forEach((vehicle) => {
      vehicleHTML += `
                            <input type='radio' id='vehicle-${
                              vehicle.id
                            }' name='vehicle' value='${vehicle.id}'/>
                            <label for="vehicle-${
                              vehicle.id
                            }" class="cursor-pointer">
                            <div class="relative bg-[rgba(0,0,0,.2)] p-2 w-full h-[100px] mt-5 rounded-lg flex" style="box-shadow:1px 1px 1px rgba(0,0,0,.2),inset 1px 1px 1px rgba(255,255,255,.2)">
                          <div class="absolute top-0.5 right-0.5 bg-yellow-600 flex rounded-md px-1 justify-center items-center">
                            <span class="text-[12px] text-white text-semibold mx-0.5">${
                              vehicle.year
                            }</span>
                            </div>
                                <div class="garage-icon border-2 w-2/4 rounded-md overflow-hidden">
                              <img src="/uploads/${
                                vehicle.condition_image
                              }" onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_m1Mo28LAzg1Kh1W_Shx1thW0sU_zgxM6LA&s'" class="h-full w-full bg-cover rounded-md" alt="garage">
                          </div>
                          <div class="garage-info w-3/4 p-2 flex flex-col ">
                            <div class="flex">
                            <strong class="text-white text-sm">Plat-No</strong> : <p class="pl-2 text-sm break-all text-[rgba(255,255,255,.6)] ">${
                              vehicle.register_plate_number
                            }</p>
                              </div>
                              <div class="flex">
                            <strong class="text-white text-sm">Model</strong> : <p class="pl-2 text-sm break-all text-[rgba(255,255,255,.6)] ">${
                              vehicle.model
                            }</p>
                              </div>
                                <div class="flex">
                            <strong class="text-white text-sm">Brand</strong> : <p class="pl-2 text-sm break-all text-[rgba(255,255,255,.6)] ">${
                              vehicle.brand
                            }</p>
                              </div>
                            
                            </div>
                            <div class="absolute bottom-0.5 right-0.5 bg-purple-600 flex rounded-md p-1 justify-center items-center">
                              <img class="mx-0.5 h-[20px] w-[20px] rounded-md" src="/icons/vehicleType/${vehicle.name.toLowerCase()}.svg" style="-webkit-filter: grayscale(1) invert(1);filter: grayscale(1) invert(1);"  >
                              </div>
                          </div>
                      </div></label>
                            
                            `;
    });
    return vehicleHTML;
  }
  static service(serviceData) {
    let serviceList = "<input type='text' placeholder='search' oninput='filterServices(event)'>";
    serviceData.forEach((ele) => {
      serviceList += `
                            <input type="checkbox" class="hidden" name="service" id="${
                              ele.id
                            }" value="${ele.id}">
                            <label for="${ele.id}" class="cursor-pointer">
                            <div class="relative bg-[rgba(0,0,0,.2)] p-2 w-full h-[100px] mt-5 rounded-lg flex serviceContainer" style="box-shadow:1px 1px 1px rgba(0,0,0,.2),inset 1px 1px 1px rgba(255,255,255,.2)">
                <div class="garage-icon border-2 w-2/4 rounded-md overflow-hidden">
                                <img src="/assets/service.png"
                                        onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeUyb754vebKqfbxScXd11wIOQGyxRlNNQBv31JG4wC9ytLmJgMP3i__68EPQpIN3vrPk&usqp=CAU'"
                                        class="h-full w-full bg-cover" alt="garage" class="object-cover">
                </div>
                <div class="garage-info w-3/4 service-info pl-2">
                                <h3 class="font-semibold text-[14px] text-left text-white wrap-none" id="serviceName">${
                                  ele.name.length > 15
                                    ? ele.name.substring(0, 12) + ".."
                                    : ele.name
                                }</h3>
                                <p class=" text-xs text-left text-white">${ele.description.substring(
                                  0,
                                  40
                                )}..</p>
                                </div>
                                <div class="flex justify-end items-center absolute bottom-2 right-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px"
                                                viewBox="0 0 24 24">
                                                <path fill="white"
                                                        d="M17 6V4H6v2h3.5c1.302 0 2.401.838 2.815 2H6v2h6.315A2.994 2.994 0 0 1 9.5 12H6v2.414L11.586 20h2.828l-6-6H9.5a5.007 5.007 0 0 0 4.898-4H17V8h-2.602a4.933 4.933 0 0 0-.924-2z" />
                                        </svg>
                                        <p class="text-white text-md text-bold">${
                                          ele.price
                                        }</p>
                                </div>
                </div>
                </label>
                `;
    });
    return serviceList;
  }
  static slots(slotData) {
    let slotHTML = "";
    slotData.forEach((slot) => {
      slotHTML += `
                            <input type='radio' id='slot-${
                              slot.id
                            }' name='slots' value='${slot.id}'/>
                            <label for="slot-${slot.id}" class="cursor-pointer">
                            <div class="flex justify-center items-center relative bg-[rgba(0,0,0,.2)] p-2 w-full h-[100px] mt-5 rounded-lg " style="box-shadow:1px 1px 1px rgba(0,0,0,.2),inset 1px 1px 1px rgba(255,255,255,.2)">
                            <strong class="text-white text-bold text-2xl">${
                              slot.start_time.split(" ")[1]
                            } - ${slot.end_time.split(" ")[1]}</strong>
                                </div></label>
                            `;
    });
    return slotHTML;
  }
}
class steps {
  static async dashboard() {
    let location = await getUserLocation();
    let [lat, long] = location;
    htmlHandler.getData(
      "garage",
      "Near by Garages",
      `/10/${lat}/${long}`,
      "No garage Found..!!",
      "dashboard",
      "garageSelection"
    );
  }
  static vehicle() {
    htmlHandler.getData(
      "type",
      "Vehicle Types",
      "",
      "No Vehicle Type Found..!!",
      "vehicle",
      "vehicleTypeSelection"
    );
  }
  static vehicleList() {
    let typeId = localStorage.getItem("typeId");
    htmlHandler.getData(
      "vehicle",
      "Your Vehicles",
      `/${typeId}`,
      "No Vehicle Found..!!",
      "vehicleList",
      "vehicleSelection"
    );
  }
  static service() {
    let id = localStorage.getItem("garageId");
    htmlHandler.getData(
      "service",
      "Services",
      `/${id}`,
      "No Service Found..!!",
      "service",
      "serviceSelection"
    );
  }
  static slots(date) {
    let id = localStorage.getItem("garageId");
    date = date || new Date().toISOString().split("T")[0];
    htmlHandler.getData(
      "slots",
      "Slot List",
      `/${id}/${date}`,
      "No Slots Found..!!",
      "slots",
      "slotSelection"
    );
  }
  static payment() {
    // htmlHandler.getData(
    //   "payment",
    //   "Payment Details",
    //   "",
    //   "No payment methods added..!!",
    //   "payment",
    //   "payment"
    // );
  }
  static profile() {
    document.querySelector("#mapScreen").style.display = "none";
    document.querySelector("#otherScreen").style.display = "none";
    document.querySelector("#profile-container").style.zIndex = 404;
    let profileHTML = `
    <div class="w-full p-2">
      <div class="flex justify-between items-center">
        <div class="cursor-pointer  bg-dark w-[40px] h-[40px] rounded-full flex justify-center items-center" onclick="home()">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" style="fill:white;transform: ;msFilter:;">
            <path d="M13.939 4.939 6.879 12l7.06 7.061 2.122-2.122L11.121 12l4.94-4.939z">
            </path>
          </svg>
        </div>
        <div class="float-right">
          <div class="float-right relative bg-lightbg rounded-full shadow p-1 -mt-[1px]" id="notification" onclick="showNotification()">
            <div class="absolute rounded-full w-[20px] h-[20px] ml-3 -mt-1 text-center flex justify-center items-center" style="background-color: rgb(248 113 113);">
              <div class="absolute text-sm text-white text-center totalNotification" id="userTotalNotification">
                0
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="hover:cursor-pointer" onclick="showAppointments()" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
              <path d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-7.414V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v4.586l-1.707 1.707A.996.996 0 0 0 3 17v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a.996.996 0 0 0-.293-.707L19 14.586z">
              </path>
            </svg>
          </div>
        </div>
      </div>  
      <div class="w-full h-full flex">
        <div class="w-[4%] mt-6 h-max flex justify-start items-end rotate-90">
          <div class="flex">
            <div id="btn-half" class="hours cursor-pointer rounded-md w-max mx-2 p-2 px-4 h-full text-white bg-dark opacity-100 rotate-180" id="user-profile" onclick="fillProfile()">
            Profile
            </div>
            <div id="btn-full" class="hours cursor-pointer rounded-md w-max mx-2 p-2 px-4 h-full text-white bg-dark opacity-50 rotate-180" id="user-appointments" onclick="showAppointments()">
            Appointments
            </div>
            <div id="btn-double" class="hours cursor-pointer rounded-md w-max mx-2 p-2 px-4 h-full text-white bg-dark opacity-50 rotate-180" onclick=showUserVehicles() >
            Vehicles
            </div>
          </div>
        </div>          
        <div class="w-full h-full overflow-y-auto flex-wrap relative hidden" id="user-profile">
          </div>
          <div id="user-appointments" class="w-[96%] h-full overflow-y-auto flex-wrap pt-5 pr-4 pl-10">
          </div>
          <div id="user-vehicles" class="w-[96%] h-full overflow-y-auto flex-wrap pt-5 pr-4 pl-10 hidden">
            <div class="flex flex-wrap mx-auto h-full w-full" id="vehicle-card">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
 `;
    document.getElementById("profile-container").innerHTML = profileHTML;
    showAppointments();
  }
}
