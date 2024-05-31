const calendar = document.querySelector("#calendar");
const monthBanner = document.querySelector("#calendar-month");
let navigation = 0;
let clicked = null;

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const loadCalendar = () => {
  const date = new Date();

  if (navigation != 0) {
    date.setMonth(new Date().getMonth() + navigation);
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  monthBanner.innerText = `${date.toLocaleDateString("en-us", {
    month: "long",
  })} ${year}`;

  calendar.innerHTML = "";
  const dayInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const dateText = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const dayString = dateText.split(", ")[0];
  const emptyDays = weekdays.indexOf(dayString);

  for (let i = 1; i <= dayInMonth + emptyDays; i++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");
    const monthVal = month + 1 < 10 ? "0" + (month + 1) : month + 1;
    const dateVal = i - emptyDays < 10 ? "0" + (i - emptyDays) : i - emptyDays;
    const dateText = `${year}-${monthVal}-${dateVal}`;
    if (i > emptyDays) {
      dayBox.innerText = i - emptyDays;

      if (i - emptyDays === day && navigation == 0) {
        dayBox.id = "currentDay";
      }

      dayBox.addEventListener("click", (event) => {
        showModal(event, dateText);
      });
    } else {
      dayBox.classList.add("plain");
    }
    calendar.append(dayBox);
  }
};

const buttons = () => {
  const btnBack = document.querySelector("#btnBack");
  const btnNext = document.querySelector("#btnNext");

  btnBack.addEventListener("click", () => {
    navigation--;
    loadCalendar();
  });

  btnNext.addEventListener("click", () => {
    navigation++;
    loadCalendar();
  });

  modal.addEventListener("click", closeModal);
};

const modal = document.querySelector("#modal");
const appointmentsContainer = document.querySelector("#viewAppointments");

const showModal = async (event, dateText) => {
  document.getElementById("currentDay")?.removeAttribute("id");
  event.target.id = "currentDay";
  clicked = dateText;
  const startDate = new Date(dateText);
  let time = startDate.getTime();
  time += 24 * 60 * 60 * 1000;
  const endDate = new Date(time);
  let garageId = document.querySelector("#garage-select #garageList").value;
  const formData = new FormData();
  formData.append("garageId", garageId);
  formData.append(
    "startDate",
    startDate.toISOString().slice(0, 19).replace("T", " ")
  );
  formData.append(
    "endDate",
    endDate.toISOString().slice(0, 19).replace("T", " ")
  );

  let result = await fetch("/owner/slots/appointmentsByDateRange", {
    method: "POST",
    body: new URLSearchParams(formData),
  });
  result = await result.json();
  let appointments = result.appointments;
  const body = document.getElementById("appointment-body");
  let str = "";
  let i = 1;
  appointments.forEach((appointment) => {
    str += `<tr>
      <td>${i++}</td>
      <td>${appointment.customerName}</td>
      <td>${appointment.startTime.slice(11, 16)} - ${appointment.endTime.slice(
      11,
      16
    )}</td>
    </tr>`;
  });
  body.innerHTML = str;
  appointmentsContainer.style.display = "block";
  if (str.trim() == "") {
    body.innerHTML = `
    <tr>
    <td colspan="3">
    <div class="w-full h-[80vh] flex justify-center items-center flex-col">
        <svg class="fill-[#ef4444]" width="100px" height="100px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M520.741 163.801a10.234 10.234 0 00-3.406-3.406c-4.827-2.946-11.129-1.421-14.075 3.406L80.258 856.874a10.236 10.236 0 00-1.499 5.335c0 5.655 4.585 10.24 10.24 10.24h846.004c1.882 0 3.728-.519 5.335-1.499 4.827-2.946 6.352-9.248 3.406-14.075L520.742 163.802zm43.703-26.674L987.446 830.2c17.678 28.964 8.528 66.774-20.436 84.452a61.445 61.445 0 01-32.008 8.996H88.998c-33.932 0-61.44-27.508-61.44-61.44a61.445 61.445 0 018.996-32.008l423.002-693.073c17.678-28.964 55.488-38.113 84.452-20.436a61.438 61.438 0 0120.436 20.436zM512 778.24c22.622 0 40.96-18.338 40.96-40.96s-18.338-40.96-40.96-40.96-40.96 18.338-40.96 40.96 18.338 40.96 40.96 40.96zm0-440.32c-22.622 0-40.96 18.338-40.96 40.96v225.28c0 22.622 18.338 40.96 40.96 40.96s40.96-18.338 40.96-40.96V378.88c0-22.622-18.338-40.96-40.96-40.96z"/></svg>
        <h2 class="text-[#ef4444] font-bold text-2xl">Oops..!!</h2><p class="text-[#ef4444]"><b>No appointments to display...!!!</b></p>
  </div></td></tr>`;
  }
};

const closeModal = () => {
  appointmentsContainer.style.display = "none";
  addEventForm.style.display = "none";
  modal.style.display = "none";
  clicked = null;
  loadCalendar();
};
