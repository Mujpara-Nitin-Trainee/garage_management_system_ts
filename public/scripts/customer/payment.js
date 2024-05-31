
const paymentPage = () => {
  let formPlace = document.getElementById("other");
  formPlace.style.display = "flex";
  formPlace.style.zIndex = 1003;
  formPlace.innerHTML = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment</title>
      <link
        href=" https://cdn.jsdelivr.net/npm/sweetalert2@11.10.7/dist/sweetalert2.min.css "
        rel="stylesheet"
      />
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                dark: "#152533",
                lightBlue: "#D9D9D9",
                blue: "#355364",
                white: "#FFFFFF",
                light: "#D9D9D9",
                lightbg: "#d7e0e7",
                lightorange: "burlywood",
                card1bg: "rgba(255, 225, 200, 0.5)",
                card1text: "#e96a00",
                card2bg: "rgba(225, 246, 247, 0.5)",
                card2text: "#34cdd0",
                card3bg: "rgba(252, 226, 225, 0.5)",
                card3text: "#df5e5e",
                card4bg: "rgba(237, 231, 251, 0.5)",
                card4text: "#9a78ea",
                red: "#ff0000",
                green: "#00FF00",
                black: "#000000",
              },
            },
          },
        };
      </script>
    </head>
    <body class="bg-lightbg">
      <div class="mx-auto p-10" id="payment-container">
        <h1 class="text-center text-dark text-3xl font-bold">Payment Details</h1>
        <p class="text-center mt-5 text-lg text-dark">
          Payment of : ₹ 100 /-
        </p>
        <div class="mx-auto mt-10 bg-white rounded-[19px] py-10 px-7">
          <div class="flex mx-auto justify-center">
            <label class="text-dark text-lg">Choose a payment type:</label>
            <select
              class="rounded-lg ml-2 pl-2 h-[30px] my-auto text-dark w-[250px] text-sm bg-lightbg"
              id="payment-type"
              onchange="changePayment()"
              name="paymentType"
            >
              <option value="card">Debit Card/Credit Card</option>
              <option value="upi">UPI</option>
              <option value="net banking">Net Banking</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div class="flex mx-auto justify-center mt-5" id="bank-section">
            <label class="text-dark text-lg">Choose your bank: </label>
            <select
              class="rounded-lg ml-[52px] pl-2 h-[30px] my-auto text-dark w-[250px] text-sm bg-lightbg"
              name="bankName"
            >
              <option value="sbi">SBI Bank</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="bob">Bank of Baroda</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
            </select>
          </div>
          <div
            class="bg-dark h-[1px] w-[700px] mx-auto mt-10"
            id="payment-line"
          ></div>
          <div class="mt-5" id="card-section">
            <h2 class="text-center text-2xl text-dark">Card Details</h2>
            <div class="flex justify-center mt-5">
              <label class="text-dark text-lg">Card Number: </label>
              <input
                class="ml-[72px] rounded h-[30px] bg-lightbg placeholder:text-dark placeholder:opacity-70 px-2"
                name="cardNumber"
                type="text"
                placeholder="Enter card number"
              />
            </div>
            <div class="flex justify-center mt-5">
              <label class="text-dark text-lg">Account holder name: </label>
              <input
                class="ml-2 rounded h-[30px] bg-lightbg placeholder:text-dark placeholder:opacity-70 px-2"
                name="accountHolder"
                type="text"
                placeholder="Enter card holder name"
              />
            </div>
            <div class="flex justify-center">
              <div class="flex justify-center mt-5">
                <label class="text-dark text-lg">CVV: </label>
                <input
                  class="ml-2 rounded h-[30px] w-[50px] bg-lightbg placeholder:text-2xl placeholder:text-dark placeholder:opacity-60 px-2"
                  name="cvv"
                  type="text"
                  maxlength="3"
                  placeholder="- - -"
                />
              </div>
              <div class="flex justify-center mt-5 ml-[85px]">
                <label class="text-dark text-lg">Expiry Date: </label>
                <input
                  class="ml-[35px] rounded h-[30px] w-[100px] bg-lightbg placeholder:text-dark placeholder:opacity-60 px-2"
                  name="expiryDate"
                  type="text"
                  placeholder="MM-YYYY"
                />
              </div>
            </div>
          </div>
          <div class="mt-5 hidden" id="upi-section">
            <h2 class="text-center text-2xl text-dark">UPI Details</h2>
            <div class="flex justify-center mt-5">
              <label class="text-dark text-lg">UPI Id: </label>
              <input
                class="ml-2 rounded h-[30px] bg-lightbg placeholder:text-dark placeholder:opacity-70 px-2"
                name="upi"
                type="text"
                placeholder="Enter your UPI id"
              />
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
};

const changePayment = () => {
  let paymentType = document.getElementById("payment-type");
  let bankSection = document.getElementById("bank-section");
  let cardSection = document.getElementById("card-section");
  let paymentLine = document.getElementById("payment-line");
  let upiSection = document.getElementById("upi-section");

  if (paymentType.value == "card") {
    bankSection.style.display = "";
    cardSection.style.display = "block";
    paymentLine.style.display = "block";
    upiSection.style.display = "none";
  }
  if (paymentType.value == "upi") {
    bankSection.style.display = "";
    cardSection.style.display = "none";
    paymentLine.style.display = "block";
    upiSection.style.display = "block";
  }
  if (paymentType.value == "net banking") {
    bankSection.style.display = "";
    cardSection.style.display = "none";
    paymentLine.style.display = "none";
    upiSection.style.display = "none";
  }
  if (paymentType.value == "cash") {
    bankSection.style.display = "none";
    cardSection.style.display = "none";
    paymentLine.style.display = "none";
    upiSection.style.display = "none";
  }
};

const addPayment = async (finalAmount) => {
  let fields = document
    .getElementById("payment-container")
    .querySelectorAll("*");
  let data = {};
  fields.forEach((element) => {
    if (element.tagName == "INPUT" || element.tagName == "SELECT") {
      data[element.name] = element.value;
    }
  });
  let url = window.location.href;
  url = url.split("/");
  let appointmentId = url[url.length - 1];
  data.finalAmount = finalAmount;
  let paymentRequest = await fetch(`/customer/payment/${appointmentId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let paymentResponse = await paymentRequest.json();
  
  if (paymentResponse.success) {

    await generateInvoice(appointmentId, paymentResponse.customerEmail);
    Swal.fire({
      title: "Good job!",
      text: "Payment is done",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
      allowOutsideClick: false,
    });
  }
};

//////
//  Swal.fire({
//    width: "800px",
//    showConfirmButton: false,
//    html: `
//         <div class="mx-auto px-4" id="payment-container">
//       <h1 class="text-center text-dark text-3xl font-bold">Payment Details</h1>
//       <p class="text-center mt-5 text-lg text-dark">
//         Payment of : Slot Booking Charges (₹ 20 /-)
//       </p>
//       <div class="mx-auto mt-10 bg-white rounded-md py-10">
//         <div class="flex mx-auto justify-between">
//           <label class="text-dark text-lg font-semibold  text-left">Choose a payment type:</label>
//           <select
//             class="rounded-lg  px-2 py-2 h-[40px] my-auto text-dark w-3/5 text-sm bg-lightbg"
//             id="payment-type"
//             onchange="changePayment()"
//             name="paymentType"
//           >
//             <option value="card">Debit Card/Credit Card</option>
//             <option value="upi">UPI</option>
//             <option value="net banking">Net Banking</option>
//             <option value="cash">Cash</option>
//           </select>
//         </div>
//         <div class="flex justify-between mt-5" id="bank-section">
//           <label class="text-dark text-lg font-semibold  text-left">Choose your bank: </label>
//           <select
//             class="rounded-lg  px-2 py-2 h-[40px] my-auto text-dark w-3/5 text-sm bg-lightbg"
//             name="bankName"
//           >
//             <option value="sbi">SBI Bank</option>
//             <option value="hdfc">HDFC Bank</option>
//             <option value="bob">Bank of Baroda</option>
//             <option value="icici">ICICI Bank</option>
//             <option value="axis">Axis Bank</option>
//           </select>
//         </div>
//         <div
//           class="bg-dark h-[1px] w-[700px] mx-auto mt-10"
//           id="payment-line"
//         ></div>
//         <div class="w-full" id="card-section">
//           <h2 class="text-2xl text-dark font-bold">Card Details</h2>
//           <div class="flex justify-center mt-5">
//             <label class="text-dark text-lg">Card Number: </label>
//             <input
//               class="ml-[72px] rounded h-[30px] bg-lightbg placeholder:text-dark placeholder:opacity-70 px-2"
//               name="cardNumber"
//               type="text"
//               placeholder="Enter card number"
//             />
//           </div>
//           <div class="flex justify-center mt-5">
//             <label class="text-dark text-lg">Account holder name: </label>
//             <input
//               class="ml-2 rounded h-[30px] bg-lightbg placeholder:text-dark placeholder:opacity-70 px-2"
//               name="accountHolder"
//               type="text"
//               placeholder="Enter card holder name"
//             />
//           </div>
//           <div class="flex justify-center">
//             <div class="flex justify-center mt-5">
//               <label class="text-dark text-lg">CVV: </label>
//               <input
//                 class="ml-2 rounded h-[30px] w-[50px] bg-lightbg placeholder:text-2xl placeholder:text-dark placeholder:opacity-60 px-2"
//                 name="cvv"
//                 type="text"
//                 maxlength="3"
//                 placeholder="- - -"
//               />
//             </div>
//             <div class="flex justify-center mt-5 ml-[85px]">
//               <label class="text-dark text-lg">Expiry Date: </label>
//               <input
//                 class="ml-[35px] rounded h-[30px] w-[100px] bg-lightbg placeholder:text-dark placeholder:opacity-60 px-2"
//                 name="expiryDate"
//                 type="text"
//                 placeholder="MM-YYYY"
//               />
//             </div>
//           </div>
//         </div>
//         <div class="mt-5 hidden" id="upi-section">
//           <h2 class="text-center text-2xl text-dark">UPI Details</h2>
//           <div class="flex justify-center mt-5">
//             <label class="text-dark text-lg">UPI Id: </label>
//             <input
//               class="ml-2 rounded h-[30px] bg-lightbg placeholder:text-dark placeholder:opacity-70 px-2"
//               name="upi"
//               type="text"
//               placeholder="Enter your UPI id"
//             />
//           </div>
//         </div>
//         <div class="mt-10">
//           <p
//             class="text-center text-white mx-auto pt-[13px] rounded bg-dark w-[120px] h-[50px] hover:cursor-pointer"
//           >
//             Pay Now
//           </p>
//         </div>
//       </div>
//     </div>
//   `,
//  }).then((result) => {
//    if (result.isConfirmed) {
//      let timerInterval;
//      Swal.fire({
//        title: "Your Payment is in Preogress..!!",
//        timer: 2000,
//        timerProgressBar: true,
//        didOpen: () => {
//          Swal.showLoading();
//        },
//        willClose: () => {
//          clearInterval(timerInterval);
//        },
//      }).then((result) => {
//        Swal.fire({
//          position: "top-end",
//          icon: "success",
//          title: "Payment Done..",
//          showConfirmButton: false,
//          timer: 1500,
//          didOpen: () => {
//            // Swal.showLoading();
//          },
//          willClose: () => {
//            localStorage.clear();
//            // location.href = "/customer/profile";
//            return;
//          },
//        });
//      });
//    }
//  });
