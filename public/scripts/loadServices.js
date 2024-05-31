const showServices = async (parent) => {
  const select = document.querySelector(`#${parent}-servicesList`);
  const option = select[select.selectedIndex].value;
  const payLoad = {
    garageId: option,
  };
  const service =
    parent == "service-container"
      ? await callAPI("/owner/ownerServices", payLoad, "POST")
      : await callAPI(`/owner/services/all/${option}`);
  const services = service.services;
  let string = "";
  if (!services.length) {
    string = `
    <div class="w-full h-[80vh] flex justify-center items-center flex-col">
        <svg class="fill-[#ef4444]" width="100px" height="100px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M520.741 163.801a10.234 10.234 0 00-3.406-3.406c-4.827-2.946-11.129-1.421-14.075 3.406L80.258 856.874a10.236 10.236 0 00-1.499 5.335c0 5.655 4.585 10.24 10.24 10.24h846.004c1.882 0 3.728-.519 5.335-1.499 4.827-2.946 6.352-9.248 3.406-14.075L520.742 163.802zm43.703-26.674L987.446 830.2c17.678 28.964 8.528 66.774-20.436 84.452a61.445 61.445 0 01-32.008 8.996H88.998c-33.932 0-61.44-27.508-61.44-61.44a61.445 61.445 0 018.996-32.008l423.002-693.073c17.678-28.964 55.488-38.113 84.452-20.436a61.438 61.438 0 0120.436 20.436zM512 778.24c22.622 0 40.96-18.338 40.96-40.96s-18.338-40.96-40.96-40.96-40.96 18.338-40.96 40.96 18.338 40.96 40.96 40.96zm0-440.32c-22.622 0-40.96 18.338-40.96 40.96v225.28c0 22.622 18.338 40.96 40.96 40.96s40.96-18.338 40.96-40.96V378.88c0-22.622-18.338-40.96-40.96-40.96z"/></svg>
        <h2 class="text-[#ef4444] font-bold text-2xl">Oops..!!</h2><p class="text-[#ef4444]"><b> No Service available...!!!</b></p>
  </div>
    `;
  } else {
    if (parent == "add-service-container") {
      string += `<div class="flex w-1/3 h-[150px] p-2 relative">
    <div class="w-full h-full rounded-md overflow-hidden flex flex-col cursor-pointer bg-white p-2 justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 24 24"><path class="fill-light" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/></svg>
    <p class="opacity-50">other service</p>
    </div></div>`;
    }
    services.forEach((service) => {
      string += `
    <div class="flex w-1/3 h-[150px] p-2 relative">`;
      if (parent == "service-container")
        string += `<div class="cursor-pointer absolute top-1 right-1 bg-red p-1 rounded-full" onclick="deleteService('${service.id}','${service.name}')" ><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="white" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg></div>`;
      else
        string += `<div class="cursor-pointer absolute top-1 right-1 bg-green p-1 rounded-full" onclick="newService('${service.id
          }','${option}','${service.name}','${service?.description.substring(
            0,
            100
          )}')"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="white" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/></svg></div>`;
      string += `<div class="w-full h-full rounded-md overflow-hidden flex bg-white p-2">  
      <div class="w-[150px] rounded-md overflow-hidden h-full">
          <img class="object-cover h-full" src="/assets/service.png" alt="product image" />
      </div>
      <div class="p-2 pt-0 h-full w-full relative">
        <h5 class="text-lg text-dark font-bold tracking-wide text-left">${service.name
        }</h5>
            <div class="mt-2 mb-5  text-left">
          <p class=" text-blue text-sm">
            ${service?.description.substring(0, 100)}
          </p>
          ${parent == "service-container"
          ? `<span class="text-xl font-bold text-slate-900 absolute bottom-0 right-0">${service.price}</span>`
          : ""
        }
        </div>
      </div>
      </div>
    </div>
    `;
    });
  }
  document.querySelector(`.${parent} #services-row`).innerHTML = string;
};
const loadService = async (parent) => {
  let panel = document.querySelector(`.${parent}`);
  if (parent == "service-container") {
    document.querySelector(".add-service-container").style.display = "none";
  } else {
    document.querySelector(".service-container").style.display = "none";
  }
  panel.style.display = "block";
  const garageList = await callAPI("/owner/garages/getGaragesList");
  const garages = garageList.garages;
  let options = "";
  garages.forEach((garage) => {
    options += `<option class="text-white" value=${garage.garage_id}>${garage.garage_name}</option>`;
  });
  let select = document.querySelector(`#${parent}-servicesList`);
  select.innerHTML = options;
  select.addEventListener("change", () => showServices(parent));
  showServices(parent);
};
const addServiceBtnClick = async (e, id, garage_id) => {
  e.preventDefault();
  let price = document.getElementById("service-price").value || 5;
  let response = null;
  try {
    response = await callAPI(
      "/owner/services/",
      {
        garageId: garage_id,
        serviceId: id,
        price: price,
      },
      "POST"
    );
  } catch (error) {
    response = error;
  } finally {
    Swal.close();
    toast.show(response.success ? "success" : "error", response.message);
    // setTimeout(() => {
    //   location.href = "/owner/services";
    // }, 3000);
    showServices("add-service-container");
  }
};
const newService = (id, garage_id, name, description) => {
  Swal.fire({
    title: `Add Service`,
    html: `
  <form class="max-w-sm mx-auto" onsubmit="addServiceBtnClick(event,'${id}','${garage_id}')">
    <div class="mb-5">
      <label  class="block mb-2 font-bold w-max">Name : </label>
      <input type="text" id="service-name" class="border p-2.5 border-gray-300 text-sm rounded-lg  block w-full" value="${name}" disabled/>
    </div>
    <div class="mb-5">
      <label  class="block mb-2 font-bold w-max">Description : </label>
      <textarea id="service-description" class="border p-2.5 border-gray-300 text-sm rounded-lg  block w-full" disabled>${description}</textarea>
    </div>
    <div class="mb-5">
      <label  class="block mb-2 font-bold w-max">Price : </label>
      <input type="number" id="service-price" class="border p-2.5 border-gray-300 text-sm rounded-lg  block w-full" placeholder="0000" value="100" min="5" max="20000" required/>
    </div>
    <div clss="w-full flex justify-end items-end">
        <button type="submit" class="bg-dark w-max p-2 rounded-md">Add Service</button> 
    </div>
    </form>
    `,
    showConfirmButton: false,
  }).then(() => {
    socketIo.emit("newServiceAdded");
  });
};
const deleteService = (id, name) => {
  Swal.fire({
    title: "Are you sure?",
    text: `really you want to delete ${name} Service..`,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
    icon: "question",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let response = await callAPI(`/owner/services/${id}`, {}, "DELETE");
      toast.show(response.success ? "success" : "error", response.message);
      if (response.success) {
        socketIo.emit("newServiceAdded");
        showServices('service-container');
      }
    }
  });
};
