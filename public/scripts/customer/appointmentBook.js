const book = () => {
  Swal.fire({
    title: "Are you sure ?",
    text: "you want to book Appointment..!!",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Yes, Book it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      //book logic
      let timerInterval;
      Swal.fire({
        title: "Your Slot Booking is in Preogress..!!",
        timer: 2000,
        timerProgressBar: true,
        didOpen: async () => {
          Swal.showLoading();
          let garageId = localStorage.getItem("garageId");
          let serviceId = localStorage.getItem("serviceId");
          let vehicleId = localStorage.getItem("vehicleId");
          let slotId = localStorage.getItem("slotId");
          try {
            let response = await callAPI(
              "/customer/bookAppointment",
              { garageId, serviceId, vehicleId, slotId },
              "POST"
            );
            if (response.success) {
              socketIo.emit("notification", 1);
            }
          } catch (error) {
            toast.show("error", error);
            let formPlace = document.getElementById("other");
            formPlace.style.display = "flex";
            formPlace.style.zIndex = 1003;
            return;
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Appointment in Pending..",
          showConfirmButton: false,
          timer: 1500,
          didOpen: () => {
            // Swal.showLoading();
          },
          willClose: () => {
            localStorage.clear();
            // location.href = "/customer/profile";
            localStorage.clear();
            setActive("profile");
            return;
          },
        });
      });

      // } else {
    } else {
      setActive("slots");
      localStorage.setItem("index", 4);
      document.getElementById("btn-next").classList.remove("hidden");
    }
  });
  return;
};
