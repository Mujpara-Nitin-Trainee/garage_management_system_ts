// const socketIo = io("");
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let slots;
let slotDate;
let btns = ["btn-half", "btn-full", "btn-double"];
const simpleCalendar = async () => {
  const result = await callAPI("/owner/garages/getGaragesList");
  garages = result.garages;
  let options = "";
  garages.forEach((garage) => {
    options += `<option value=${garage.garage_id}>${garage.garage_name}</option>`;
  });
  const select = document.getElementById("garage-select");
  select.innerHTML = options;
  select.addEventListener("change", garageChanged);
};

const garageChanged = () => {
  displaySlots();
};

const day = document.querySelector(".calendar-dates");

const currDate = document.querySelector(".calendar-current-date");

const preNexIcons = document.querySelectorAll(".calendar-navigation span");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const addSlot = async (garageId, start, end, date, duration = 1) => {
  date = new Date(date);
  let newStart = date.toISOString().split("T")[0] + " " + start + ":00";
  let newEnd = date.toISOString().split("T")[0] + " " + end + ":00";

  let addedSlot = await callAPI(
    "/owner/slots/insert",
    {
      garageId: garageId,
      startTime: newStart,
      endTime: newEnd,
    },
    "POST"
  );

  if (addedSlot.success) {
    socketIo.emit("newSlotAdded");
  }
  toast.show(addedSlot.success ? "success" : "error", addedSlot.message);

  displaySlots(duration, date);
};
const generateSlots = ({
  date = new Date(),
  start = "8:00",
  end = "16:00",
  duration = 1,
}) => {
  let slots = [];
  let newStart = new Date(date.toISOString().split("T")[0]);
  newStart.setHours(start.split(":")[0], start.split(":")[1]);
  let newEnd = new Date(date.toISOString().split("T")[0]);
  newEnd.setHours(end.split(":")[0], end.split(":")[1]);
  // while (newStart < new Date()) {
  //   newStart.setMinutes(newStart.getMinutes() + duration * 60);
  // }
  while (newStart < newEnd) {
    let slot =
      (newStart.getHours() < 10 ? "0" : "") +
      newStart.getHours() +
      ":" +
      (newStart.getMinutes() < 10 ? "0" : "") +
      newStart.getMinutes();
    newStart.setMinutes(newStart.getMinutes() + duration * 60);
    slot +=
      "-" +
      (newStart.getHours() < 10 ? "0" : "") +
      newStart.getHours() +
      ":" +
      (newStart.getMinutes() < 10 ? "0" : "") +
      newStart.getMinutes();
    if (newStart <= newEnd) slots.push(slot);
  }
  return slots;
};
const fetchGarageSlots = async (id) => {
  try {
    let slots = await callAPI("/owner/garages/slots", { garageId: id }, "POST");
    return slots;
  } catch (error) {
    return [];
  }
};
const displaySlots = async (duration = 1, dateVal) => {
  if (dateVal) {
    date = dateVal;
  }
  else {
    date = new Date();
  }
  if (duration == 0) {
    toast.show("error", "This feature is not available for you..!!");
  } else {
    document.querySelectorAll(".hours").forEach((btn) => {
      btn.classList.add("opacity-50");
      btn.classList.remove("opacity-100");
    });
    let btn = document.querySelector(`#${btns[parseInt(duration)]}`);
    btn.classList.remove("opacity-50");
    btn.classList.add("opacity-100");
    const selectedGarage = document.getElementById("garage-select").value;
    let availableSlots = await fetchGarageSlots(selectedGarage);
    let time = availableSlots[availableSlots.length - 1];
    let slots = generateSlots({
      date: date,
      start: time.open_time.split(" ")[1],
      end: time.close_time.split(" ")[1],
      duration,
    });
    let slotCard = "";
    slots = slots.filter((slot) => {
      let flag = false;
      let slotStart =
        date.toISOString().split("T")[0] + " " + slot.split("-")[0] + ":00";
      let slotEnd =
        date.toISOString().split("T")[0] + " " + slot.split("-")[1] + ":00";
      availableSlots
        .slice(0, availableSlots.length - 1)
        .forEach((available) => {
          if (
            (available.startTime <= slotStart &&
              available.endTime > slotStart) ||
            (available.startTime < slotEnd && available.endTime >= slotEnd)
          ) {
            flag = true;
            return;
          }
        });
      if (!flag) return slot;
    });
    if (!slots.length) {
      slotCard = `
     <div class="w-full h-[80vh] flex justify-center items-center flex-col">
        <svg class="fill-[#ef4444]" width="100px" height="100px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M520.741 163.801a10.234 10.234 0 00-3.406-3.406c-4.827-2.946-11.129-1.421-14.075 3.406L80.258 856.874a10.236 10.236 0 00-1.499 5.335c0 5.655 4.585 10.24 10.24 10.24h846.004c1.882 0 3.728-.519 5.335-1.499 4.827-2.946 6.352-9.248 3.406-14.075L520.742 163.802zm43.703-26.674L987.446 830.2c17.678 28.964 8.528 66.774-20.436 84.452a61.445 61.445 0 01-32.008 8.996H88.998c-33.932 0-61.44-27.508-61.44-61.44a61.445 61.445 0 018.996-32.008l423.002-693.073c17.678-28.964 55.488-38.113 84.452-20.436a61.438 61.438 0 0120.436 20.436zM512 778.24c22.622 0 40.96-18.338 40.96-40.96s-18.338-40.96-40.96-40.96-40.96 18.338-40.96 40.96 18.338 40.96 40.96 40.96zm0-440.32c-22.622 0-40.96 18.338-40.96 40.96v225.28c0 22.622 18.338 40.96 40.96 40.96s40.96-18.338 40.96-40.96V378.88c0-22.622-18.338-40.96-40.96-40.96z"/></svg>
        <h2 class="text-[#ef4444] font-bold text-2xl">Oops..!!</h2><p class="text-[#ef4444]"><b>All Slots are added...!!!</b></p>
  </div>
      `;
    } else {
      slots.forEach((slot) => {
        slotCard += `
      <div class="w-1/5 h-[110px] p-2 relative">
                    <div onclick="addSlot('${selectedGarage}','${slot.split("-")[0]
          }','${slot.split("-")[1]}','${date}','${duration}')"
                        class="bg-green w-[20px] h-[20px] absolute -top-0 -right-0 rounded-full text-white cursor-pointer">
                        +
                    </div>
                    <div
                        class="cursor-pointer border-2 border-dark bg-dark  h-full w-full rounded-md flex justify-center items-center">
                        <strong class="text-white  text-xs">${slot}</strong>
                    </div>
                </div>
      `;
      });
    }
    document.getElementById("slots-list").innerHTML = slotCard;
  }
};

const manipulate = () => {
  let dayOne = new Date(year, month, 1).getDay(); // 0 - sunday
  let lastDate = new Date(year, month + 1, 0).getDate(); // 31 - january
  let dayEnd = new Date(year, month, lastDate).getDay();
  let lastMonthDate = new Date(year, month, 0).getDate();
  let lit = "";

  for (let i = dayOne; i > 0; i--) {
    lit += `<li class="inactiveDate">${lastMonthDate - i + 1}</li>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    if (
      i == new Date().getDate() &&
      month == new Date().getMonth() &&
      year == new Date().getFullYear()
    ) {
      lit += `<li class="activeDate date">${i}</li>`;
    } else if (year > new Date().getFullYear()) {
      lit += `<li class="date">${i}</li>`;
    } else if (
      month > new Date().getMonth() &&
      year == new Date().getFullYear()
    ) {
      lit += `<li class="date">${i}</li>`;
    } else if (
      i > new Date().getDate() &&
      month == new Date().getMonth() &&
      year == new Date().getFullYear()
    ) {
      lit += `<li class="date">${i}</li>`;
    } else {
      lit += `<li class="inactiveDate">${i}</li>`;
    }
  }

  for (let i = dayEnd; i < 6; i++) {
    lit += `<li class="inactiveDate">${i - dayEnd + 1}</li>`;
  }

  currDate.innerText = `${months[month]} ${year}`;
  day.innerHTML = lit;

  const dates = document.querySelectorAll("#simpleCalendar .date");
  dates.forEach((date) => {
    date.addEventListener("click", (e) => {
      let duration = btns.indexOf(
        document.querySelector(".hours.opacity-100").id
      );
      duration = duration == 0 ? 0.5 : duration;
      slotDate = e.target.innerText;
      let active = document.getElementsByClassName("activeDate")[0];
      if (active) active.classList.remove("activeDate");
      e.target.classList.add("activeDate");
      let startDate = year + "-";
      if (month + 1 < 10) startDate += 0;
      startDate += month + 1 + "-";
      if (slotDate.length == 1) startDate += 0;
      startDate += slotDate;
      displaySlots(duration, new Date(startDate));
    });
  });
};

preNexIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    month = icon.id === "calendar-prev" ? month - 1 : month + 1;

    if (month < 0 || month > 11) {
      date = new Date(year, month, new Date().getDate());
      year = date.getFullYear();
      month = date.getMonth();
    } else {
      date = new Date();
    }
    manipulate();
  });
});
