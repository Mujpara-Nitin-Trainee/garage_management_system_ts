const getTaskGarages = async () => {
  let response = await callAPI(`/owner/garages/getGaragesList`);
  response.garages.forEach((element) => {
    if (document.getElementById(element.garage_id)) {
      document.getElementById(element.garage_id).remove();
    }
    let option = document.createElement("option");
    option.value = element.garage_id;
    option.id = element.garage_id;
    option.textContent = element.garage_name;
    document.getElementById("garage-list").appendChild(option);
  });
  getVehicleTasks();
};

const getVehicleTasks = async (page = 1) => {
  let garageId = document.getElementById("garage-list").value;
  let response = await callAPI(
    `/owner/vehicleStatus/${garageId}?page=${Number(page)}`
  );
  let tasksList = ``;
  let statuses = [];
  if (response.result.length == 0) {
    tasksList += `<p class="text-red text-xl">No vehicle available..</p>`;
    document.getElementById("task-list").innerHTML = tasksList;
  } else {
    tasksList += `<table class="mx-auto w-full" id="task-table">
    <thead class="text-xl">
      <tr class="bg-dark text-white">
        <th class="px-5 py-3">Sr. No.</th>
        <th class="px-5 py-3">Customer Name</th>
        <th class="px-5 py-3">Vehicle Brand</th>
        <th class="px-5 py-3">Vehicle Model</th>
        <th class="px-5 py-3">Model year</th>
        <th class="px-5 py-3">Number Plate</th>
        <th class="px-5 py-3">Status</th>
      </tr>
    </thead>`;
    let { totalRecords, page, startIndex, endIndex, totalPages } =
      response.pagination;
    let i = (page - 1) * 10 + 1;
    response.result.forEach((element) => {
      tasksList += `<tbody class="text-xl" id="task-body">`;
      tasksList +=
        `<tr class="text-lg border-b-2 border-dark hover:bg-lightbg">
      <td class="py-5">${i}</td>
      <td>${element.customer_name}</td>
      <td>${element.brand}</td>
      <td>${element.model}</td>
      <td>${element.year}</td>
      <td>${element.register_plate_number}</td>
      <td>
        <select class="bg-dark text-white rounded-xl p-2" id="status${i}" onchange="updateVehicleStatus(` +
        `${element.id}` +
        `,` +
        `${i})">
          <option value="1">Pending</option>
          <option value="3">In progress</option>
          <option value="2">Completed</option>
        </select>
      </td>
      </tr>`;
      statuses.push({ status: element.vehicle_status, id: `status${i}` });
      i++;
    });
    totalRecords < endIndex ? (endIndex = totalRecords) : 0;
    tasksList += `</tbody></table> <div class="pagination font-family mt-5">
    <div class="font-family pagination-text">Showing ${
      startIndex + 1
    } to ${endIndex} out of ${totalRecords} Entries</div>
    <div class="page-buttons button-group-pagination">`;
    if (page == 1) {
      tasksList += `<input
      class="font-family buttons"
      type="button"
      value="Prev"
      id="prev"
      disabled
    />`;
    } else {
      tasksList += `<input
      class="font-family buttons"
      type="button"
      value="Prev"
      id="prev"
      onclick="getVehicleTasks(${page - 1})"
    />`;
    }
    tasksList += `<div class="current font-family" id="pid">${page}</div>`;
    if (page != totalPages) {
      tasksList += `<input
        class="font-family buttons"
        type="button"
        value="Next"
        id="next"
        onclick="getVehicleTasks(${page + 1})"
      />`;
    } else {
      tasksList += `<input
        class="font-family buttons"
        type="button"
        value="Next"
        id="next"
        disabled
      />`;
    }
    tasksList += `</div>
    </div>`;
    document.getElementById("task-list").innerHTML = tasksList;
    statuses.forEach((element) => {
      let select = document.getElementById(element.id);
      select.value = element.status;
      select.removeAttribute("class");
      select.setAttribute("class", "text-black rounded-xl p-2");
      if (element.status == 2) select.classList.add("bg-green-500");
      else if (element.status == 3) select.classList.add("bg-orange-600");
      else select.classList.add("bg-amber-400");
    });
  }
};

const updateVehicleStatus = async (appointmentId, index) => {
  // const socketIo = io("");
  let select = document.getElementById(`status${index}`);
  let status = select.value;
  select.removeAttribute("class");
  select.setAttribute("class", "text-black rounded-xl p-2");
  if (status == 2) select.classList.add("bg-green-500");
  else if (status == 3) select.classList.add("bg-orange-600");
  else select.classList.add("bg-amber-400");
  const formData = new FormData();
  formData.append("status", status);
  let updateStatus = await callApiWithFormData({
    endpoint: `/owner/vehicleStatus/${appointmentId}`,
    body: new URLSearchParams(formData),
    method: "PUT",
  });
  if (updateStatus.success) {
    socketIo.emit("status", 1);
  }
};
