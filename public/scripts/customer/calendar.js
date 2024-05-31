// const socketIo = io("");
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let slotDate;

let day;
let currDate;
let preNexIcons;

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

  const dates = document.querySelectorAll("#calendarScreen .date");
  dates.forEach((date) => {
    date.onclick = (e) => {
      slotDate = e.target.innerText;
      let active = document.getElementsByClassName("activeDate")[0];
      if (active) active.classList.remove("activeDate");
      e.target.classList.add("activeDate");
      let startDate = year + "-";
      if (month + 1 < 10) startDate += 0;
      startDate += month + 1 + "-";
      if (slotDate.length == 1) startDate += 0;
      startDate += slotDate;
      steps.slots(startDate);
    };
  });
};

const addCalendar = () => {
  let formPlace = document.getElementById("other");
  formPlace.style.display = "flex";
  formPlace.style.zIndex = 1003;
  formPlace.innerHTML = `<div class="p-4 m-4 bg-white rounded-md" id="calendarScreen">
  <header class="calendar-header flex justify-between items-center px-12">
    <p class="calendar-current-date" id="month"></p>
    <div class="calendar-navigation h-full">
      <span id="calendar-prev" class="material-symbols-rounded bg-dark flex justify-center items-center">
        <img src="/icons/left.svg" alt="&lt;">
      </span>
      <span id="calendar-next" class="material-symbols-rounded bg-dark flex justify-center items-center">
        <img src="/icons/right.svg" alt="&gt;">
      </span>
    </div>
  </header>
  
  <div class="calendar-body">
    <ul class="calendar-weekdays">
      <li>Sun</li>
      <li>Mon</li>
      <li>Tue</li>
      <li>Wed</li>
      <li>Thu</li>
      <li>Fri</li>
      <li>Sat</li>
    </ul>
    <ul class="calendar-dates"></ul>
  </div>
  </div>
  
  <link rel="stylesheet" href="/styles/customer/calendar.css">
  <script src="/scripts/customer/calendar.js"></script>`;

  day = document.querySelector(".calendar-dates");
  currDate = document.querySelector(".calendar-current-date");
  preNexIcons = document.querySelectorAll(".calendar-navigation span");

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

  manipulate();
  setTimeout(() => {
    document.querySelector(".activeDate").click();
  }, 500);
};

socketIo.on("newSlotAdded", () => {
  document.querySelector(".activeDate").click();
});
