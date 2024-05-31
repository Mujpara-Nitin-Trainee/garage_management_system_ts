// const socketIo = io("");


const notification = async () => {
  let data = await callAPI("/owner/notification");

  document.querySelector('.totalNotification').innerHTML = data.notifications.length;
}

notification();

socketIo.on("Received", (message) => {
  if (message === 1) {
    notification();
    getOwnerData();
    loadAppointments();
  }
})


const successfulPayments = async (id) => {
  let data = await callAPI(`/owner/paymentStatus/${id}`);

  let currentNotificationCount = Number(document.getElementById('totalNotification').innerHTML);

  document.querySelector('.totalNotification').innerHTML = (currentNotificationCount + data.result.length);

  let userName = data.result[0].name;
  let startTime = data.result[0].start_time;
  let endTime = data.result[0].end_time;

  let userNotification = `${userName} had completed payment for slot ${startTime} to ${endTime}`;

  document.getElementById('userNameNotification').innerHTML = userName;

  document.getElementById('userNameNotification').innerHTML = userNotification;

  document.getElementById('notificationPopup').style.visibility = "visible";

  setTimeout(function () {
    document.getElementById('notificationPopup').style.visibility = "hidden";
  }, 9000)

}


socketIo.on("paymentNotification", (status) => {
  if (status !== 0) {
    successfulPayments(status);
  }
})