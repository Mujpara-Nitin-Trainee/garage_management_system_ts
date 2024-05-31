tailwind.config = {
  theme: {
    extend: {
      colors: {
        dark: "#152533",
        dark1: "#355364",
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
      },
    },
  },
};
let stars = document.getElementsByClassName("star");
let rating = 0
// Funtion to update rating
function check(n) {
  let output = document.getElementById("output");
  remove();
  for (let i = 0; i < n; i++) {
    if (n == 1) cls = "one";
    else if (n == 2) cls = "two";
    else if (n == 3) cls = "three";
    else if (n == 4) cls = "four";
    else if (n == 5) cls = "five";
    stars[i].className = "star " + cls;
  }
  output.innerText = "Rating is: " + n + "/5";
  rating = n
}

// To remove the pre-applied styling
function remove() {
  let i = 0;
  while (i < 5) {
    stars[i].className = "star";
    i++;
  }
}

var submit = document.querySelector("#submit")
// submit.addEventListener("click",validator(event))
submit.addEventListener('click', function (event) {
  if (!validator()) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  var message = document.querySelector("#message").value
  if (message == "") {
    message = null
  }
  submitData(message, rating)
})
function validator() {
  var rating = document.querySelector("#output")
  if (rating.innerText == "Rating is: 0/5") {
    return false
  }
  else {
    return true
  }
}

async function submitData(message, rating) {
  try {
    const response = await fetch("http://localhost:3000/customer/feedback", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ message: message, rating: rating, customerId: 1, garageId: 1 }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    if (response.status == 208) {
      alert("Your Feedback alredy exist")
    }
  } catch (error) {
  }
}