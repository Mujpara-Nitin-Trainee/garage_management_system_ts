const showAppointments = async () => {
  document.getElementById("user-appointments").classList.remove("hidden");
  document.getElementById("user-appointments").classList.add("flex");
  document.getElementById("user-profile").classList.remove("flex");
  document.getElementById("user-profile").classList.add("hidden");
  document.getElementById("user-vehicles").classList.remove("flex");
  document.getElementById("user-vehicles").classList.add("hidden");
  document.getElementById("btn-half").classList.remove("opacity-100");
  document.getElementById("btn-half").classList.add("opacity-50");
  document.getElementById("btn-full").classList.remove("opacity-50");
  document.getElementById("btn-full").classList.add("opacity-100");
  document.getElementById("btn-double").classList.remove("opacity-100");
  document.getElementById("btn-double").classList.add("opacity-50");
  getUserAppointments();
};

const getPayment = (appointmentId) => {
  window.location.href = `/customer/payment/${appointmentId}`;
};

const getUserAppointments = async (page = 1) => {
  let appointmentRequest = await callAPI(`/customer/appointments?page=${page}`);
  console.log(appointmentRequest);
  let userAppointments = ``;
  let { totalRecords, startIndex, endIndex, totalPages } =
    appointmentRequest.pagination;
  if (appointmentRequest.result.length == 0) {
    userAppointments += `<div class="flex flex-col mx-auto">
    <p class="text-xl mx-auto mt-12 text-red-500">No appointments have been booked yet...</p>
    <p class="bg-dark mx-auto hover:cursor-pointer h-12 px-5 mt-5 max-w-[200px] text-center pt-2 text-lg rounded-lg text-white" onclick="window.location.href='/customer/home'">Book appointment</p>
    </div>
    `;
  } else {
    userAppointments += `
    <div class="h-full w-full p-10 rounded-md bg-white">
    <h2 class="text-2xl font-bold text-left my-2">Appointment</h2>
    <table class="mx-auto w-full">
  <thead class="text-md">
    <tr class="bg-dark text-white">
      <th class="py-3">Sr. No.</th>
      <th class="py-3">Garage Name</th>
      <th class="py-3">Appointment Date</th>
      <th class="py-3">Appointment Status</th>
      <th class="py-3">Vehicle Status</th>
      <th class="py-3">Invoice</th>
    </tr>
  </thead>
  <tbody>`;
    let i = (page - 1) * 10 + 1;
    appointmentRequest.result.forEach((element) => {
      userAppointments += `<tr
    class="text-md border-b-2 border-[rgba(0,0,0,0.1)] hover:shadow-md text-center  bg-white"
  >
    <td class="py-2">${i}</td>
    <td class="py-2">${element.garage_name}</td>
    <td class="py-2">${element.start_time}</td>`;
      if (element.status == 1) {
        userAppointments += `<td class="py-2"><span class="bg-yellow-600 text-white text-xs font-medium me-2 px-3 py-1.5 rounded">pending</span></td>`;
      } else if (element.status == 2) {
        userAppointments += `<td class="py-2"><span class="bg-cyan-600 text-white text-xs font-medium me-2 px-3 py-1.5 rounded">approved</span></td>`;
      } else if (element.status == 3) {
        userAppointments += `<td class="py-2"><span class="bg-red-600 text-white text-xs font-medium me-2 px-3 py-1.5 rounded">rejected</span></td>`;
      } else if (element.status == 4 && element.payment_status == 2) {
        userAppointments += `<td class="py-2 text-cyan-700"><span class="bg-green-600 text-white text-xs font-medium me-2 px-3 py-1.5 rounded">completed</span></td>`;
      }
      if (element.vehicle_status == 1 && element.status == 2) {
        userAppointments += `<td class="py-2 text-yellow-600"><span class="bg-yellow-600 text-white text-xs font-medium me-2 px-3 py-1.5 rounded">To-Do</span></td></td>`;
      } else if (
        element.vehicle_status == 2 &&
        (element.status == 2 || element.status == 4)
      ) {
        if (element.payment_status == 2) {
          userAppointments += `<td class="py-2">
          <span class="bg-green-600 text-white text-xs font-medium me-2 px-3 py-1.5 rounded">completed</span>
          </td>`;
        } else {
          userAppointments += `<td class="py-2 flex justify-center">
          <button type="button" class="flex focus:outline-none text-white bg-purple-700 hover:bg-purple-800  font-medium rounded-lg text-sm px-3 py-1.5 dark:focus:ring-purple-900" onclick="getPayment(${element.appointment_id})"} >
<svg width="22px" height="22px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#ffffff" fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm7-6a1 1 0 0 0 0 2h3c.34 0 .872.11 1.29.412.19.136.372.321.505.588H7.997a1 1 0 1 0 0 2h4.798a1.58 1.58 0 0 1-.504.588A2.352 2.352 0 0 1 11 12H7.997a1 1 0 0 0-.625 1.781l5.003 4a1 1 0 1 0 1.25-1.562L10.848 14h.15c.661 0 1.629-.19 2.46-.789A3.621 3.621 0 0 0 14.896 11H16a1 1 0 1 0 0-2h-1.104a3.81 3.81 0 0 0-.367-1H16a1 1 0 1 0 0-2H8z" clip-rule="evenodd"/></svg>
<p class="ml-2 text-md font-bold">
Pay</p>
</button> </td>`;
        }
      } else if (element.vehicle_status == 3 && element.status == 2) {
        userAppointments += `<td class="py-2"><span class="bg-orange-600 text-white text-xs font-medium me-2 px-3 py-1.5 rounded">In-Progess</span></td>`;
      } else {
        userAppointments += `<td class="py-2">-</td>`;
      }
      if (
        element.vehicle_status == 2 &&
        (element.status == 2 || element.status == 4) &&
        element.payment_status == 2
      ) {
        userAppointments +=
          `<td class="mx-auto text-center flex justify-center" style="color:white">
         <button type="button" class="flex justify-between items-center text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br  focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center  m-2"
          id="download-invoice"  onclick="generateInvoice(` +
          `${element.appointment_id}` +
          `,` +
          `  '${element.customer_email}'` +
          `,this)">
<img src='/icons/download.svg' class='h-[20px]' />
          <p class='ml-2 font-bold'>Download</p>
</button>
          </td>`;
      } else {
        userAppointments += `<td>-</td></td>`;
      }
      userAppointments += `</tr>`;
      i++;
    });
    userAppointments += `</tbody> </table></div>`;
  }
  totalRecords < endIndex ? (endIndex = totalRecords) : 0;
  userAppointments += `<div class="pagination font-family mt-5" style="display: flex; justify-content: space-between; width:96%"><div class="font-family pagination-text">Showing ${
    startIndex + 1
  } to ${endIndex} out of ${totalRecords} Entries</div>
  <div class="page-buttons button-group-pagination" style="display: flex; justify-content: space-between; gap: 10px;">`;
  if (page == 1) {
    userAppointments += `<input
      class="font-family buttons hover:cursor-not-allowed"
      style="width: 75px; background-color: #d9d9d9; border-radius: 5px; border-color: #d9d9d9;padding: 5px; cursor: pointer;"
      type="button"
      value="Prev"
      id="prev"
      disabled
      />`;
  } else {
    userAppointments += `<input
      class="font-family buttons"
      style="width: 75px; background-color: #d9d9d9; border-radius: 5px; border-color: #d9d9d9;padding: 5px; cursor: pointer;"
      type="button"
      value="Prev"
      id="prev"
      onclick="getUserAppointments(${page - 1})"
      />`;
  }
  userAppointments += `<div class="current font-family" style="margin-top: 5px; font-size: medium;" id="pid">${page}</div>`;
  if (page != totalPages) {
    userAppointments += `<input
      class="font-family buttons"
      style="width: 75px; background-color: #d9d9d9; border-radius: 5px; border-color: #d9d9d9;padding: 5px; cursor: pointer;"
      type="button"
      value="Next"
      id="next"
      onclick="getUserAppointments(${page + 1})"
    />`;
  } else {
    userAppointments += `<input
      class="font-family buttons hover:cursor-not-allowed"
      style="width: 75px; background-color: #d9d9d9; border-radius: 5px; border-color: #d9d9d9;padding: 5px; cursor: pointer;"
      type="button"
      value="Next"
      id="next"
      disabled
    />`;
  }
  userAppointments += `</div> </div>`;
  document.getElementById("user-appointments").innerHTML = userAppointments;
};

socketIo.on("appointments", () => {
  getUserAppointments();
  fillNotification();
});
