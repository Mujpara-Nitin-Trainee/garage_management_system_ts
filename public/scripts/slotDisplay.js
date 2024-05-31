const handleSlots = () => {
  let labels = document.querySelectorAll("label");
  labels.forEach(element => {
    element.style.backgroundColor = 'burlywood';
  });
  let value = document.querySelector('.test:checked');
  value.parentNode.style.backgroundColor = 'white';
}

const populateSlots = async (startDate, endDate) => {
  const slotDisplay = document.getElementById("slotDisplay");
  slotDisplay.innerHTML = '';

  let garageId = localStorage.getItem("garageId");

  let payLoad = {
    "garageId": garageId,
    "startDate": startDate,
    "endDate": endDate
  }
  let data = await fetch('/customer/getSlots', {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(payLoad)
  });
  let result = await data.json();
  if (result.length == 0) {
    slotDisplay.innerHTML = ` <p class="font-serif text-2xl text-white">No Slot Avaliable</p>`;
  }
  else {
    result.forEach((element) => {
      slotDisplay.innerHTML += `<label class="rounded-lg w-68 h-14 m-5 bg-lightorange text-xl flex items-center justify-center"
            tabindex="1">
            <input class="test absolute w-0 h-0 opacity-0" type="radio" name="slotId" value="${element.id}" onclick="handleSlots()">
            <p class="font-sans hover:font-serif text-xl text-blue">
              ${element.startTime}-${element.endTime}
            </p>
          </label>`
    });
  }
}

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
const day = document.querySelector(".calendar-dates");

const currDate = document
  .querySelector(".calendar-current-date");

const preNexIcons = document
  .querySelectorAll(".calendar-navigation span");

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
  "December"
];

const displaySlots = async (e) => {
  let date;
  if (e.target) {
    date = e.target.innerText;
  } else {
    date = e.innerText;
  }
  let data = year + "-";
  let newMonth = month + 1;
  if (newMonth < 10) data += 0;
  data += newMonth + "-";
  if (date.length == 1) data += 0;
  data += date;
  const dataTime = new Date(data).getTime();
  const datePlus = new Date(dataTime + 24 * 60 * 60 * 1000);
  let dataSecond = data.slice(0, 8);
  let dateHigh = datePlus.getDate();
  if (dateHigh.length == 1) dataSecond += 0;
  dataSecond += dateHigh

  populateSlots(data, dataSecond);
}

const manipulate = () => {
  let dayOne = new Date(year, month, 1).getDay(); // 0 - sunday
  let lastDate = new Date(year, month + 1, 0).getDate(); // 31 - january
  let dayEnd = new Date(year, month, lastDate).getDay();
  let lastMonthDate = new Date(year, month, 0).getDate();
  let lit = "";

  for (let i = dayOne; i > 0; i--) {
    lit +=
      `<li class="inactiveDate">${lastMonthDate - i + 1}</li>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    if (i == new Date().getDate() && month == new Date().getMonth() && year == new Date().getFullYear()) {
      lit += `<li class="activeDate date">${i}</li>`;
    }
    else if (year > new Date().getFullYear()) {
      lit += `<li class="date">${i}</li>`;
    }
    else if (month > new Date().getMonth() && year == new Date().getFullYear()) {
      lit += `<li class="date">${i}</li>`;
    }
    else if (i > new Date().getDate() && month == new Date().getMonth() && year == new Date().getFullYear()) {
      lit += `<li class="date">${i}</li>`;
    }
    else {
      lit += `<li class="inactiveDate">${i}</li>`;
    }
  }

  for (let i = dayEnd; i < 6; i++) {
    lit += `<li class="inactiveDate">${i - dayEnd + 1}</li>`
  }

  currDate.innerText = `${months[month]} ${year}`;
  day.innerHTML = lit;

  const dates = document.querySelectorAll('#simpleCalendar .date');
  dates.forEach(date => {
    date.addEventListener('click', displaySlots);
  });
  displaySlots(dates[0]);
}
manipulate();

preNexIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    month = icon.id === "calendar-prev" ? month - 1 : month + 1;

    if (month < 0 || month > 11) {
      date = new Date(year, month, new Date().getDate());
      year = date.getFullYear();
      month = date.getMonth();
    }
    else {
      date = new Date();
    }
    manipulate();
  });
});