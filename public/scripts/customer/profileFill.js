const socketIo = io("");

const fillNotification = async () => {
  let data = await callAPI("/customer/notification");
  document.getElementById("userTotalNotification").innerHTML =
    data.notification.length;
};

socketIo.on("Received", (message) => {
  if (message) fillNotification(); getUserAppointments();
});

const fillProfile = () => {
  const profile = document.getElementById("user-profile");
  profile.innerHTML = `
  <div class="absolute top-20 right-10 flex items-center mr-4 mt-4">
  <button type="button" class="bg-dark focus:outline-none rounded-full h-full w-full">
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"
          style="fill: rgba(255, 255, 255, 1);" onclick="fillUpdateForm()">
          <path
              d="M4 21a1 1 0 0 0 .24 0l4-1a1 1 0 0 0 .47-.26L21 7.41a2 2 0 0 0 0-2.82L19.42 3a2 2 0 0 0-2.83 0L4.3 15.29a1.06 1.06 0 0 0-.27.47l-1 4A1 1 0 0 0 3.76 21 1 1 0 0 0 4 21zM18 4.41 19.59 6 18 7.59 16.42 6zM5.91 16.51 15 7.41 16.59 9l-9.1 9.1-2.11.52z">
          </path>
      </svg>
  </button>
</div>
    <div class="w-2/5 h-full">
      <img src="" class="rounded-md h-[70%] w-[75%]" id="user_profile_pic" onerror="this.src='https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-19.jpg'"/>
      <h2 class="text-3xl font-bold text-bold mt-4" id="name" >Bharat Makwana</h2>
      <p id="email" class="mt-3 text-lg"></p>
      <p id="address" class="mt-3 text-lg"></p>
      <address></address>
    </div>
      <div class="w-3/5">
        <h3 class="font-bold">Bio:</h3>
        <hr/>
        <p id="bio">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      </div>`;
  updateDetails();
};

const updateDetails = async () => {
  document.getElementById("user-profile")?.classList.remove("hidden");
  document.getElementById("user-profile").classList.add("flex");
  document.getElementById("user-appointments").classList.remove("flex");
  document.getElementById("user-appointments").classList.add("hidden");
  document.getElementById("user-vehicles").classList.remove("flex");
  document.getElementById("user-vehicles").classList.add("hidden");
  document.getElementById("btn-full").classList.remove("opacity-100");
  document.getElementById("btn-full").classList.add("opacity-50");
  document.getElementById("btn-half").classList.remove("opacity-50");
  document.getElementById("btn-half").classList.add("opacity-100");
  document.getElementById("btn-double").classList.remove("opacity-100");
  document.getElementById("btn-double").classList.add("opacity-50");

  const userDetails = await fetch("/userDetails");
  const userJson = await userDetails.json();
  const user = userJson.user;
  const address = userJson.address;
  const vehicleServices = userJson.vehicleServices;
  const bio = document.getElementById("bio");
  bio.innerText = user.bio || "please update your biodata";

  const profilePic = document.querySelector("#prifile_pic");
  profilePic.setAttribute("src", user.profile_pic);
  const userProfilePic = document.querySelector("#user_profile_pic");
  userProfilePic.setAttribute("src", `/uploads/${user.profile_pic}`);
  document.getElementById("name").innerHTML = user.name;
  document.getElementById(
    "email"
  ).innerHTML = `<b class="text-xl mr-2">Email:</b> ${user.email}`;
  document.getElementById("address").innerHTML =
    `<b class="text-xl mr-2">Address:</b>` +
    address.area +
    ", " +
    address.cityName +
    ", " +
    address.stateName +
    ", Pincode: " +
    address.pincode;
};

const handleProfile = (id) => {
  let divs = ["profile", "editProfile"];
  document.getElementById(divs[1]).classList.remove("hidden");
  document.getElementById(divs[id]).classList.remove("hidden");
  document.getElementById(divs[(id + 1) % 2]).classList.add("hidden");
  if (id == 1) document.getElementById(divs[1]).classList.add("block");
};
const fillUpdateForm = () => {
  const updateProfile = document.getElementById("user-profile");
  updateProfile.innerHTML = `              
  <form method="post" id="updateCustomer" class="w-[96%] h-[90%] bg-white rounded-md mx-5 flex p-6 flex-col"
      onsubmit="handleUpdateForm(event)" enctype="multipart/form-data">
  
      <div class="flex flex-grow my-4">
          <div class="w-1/3 h-full">
              <div class="relative rounded overflow-hidden">
                  <label for="profile_pic"
                      class="relative flex flex-col items-center justify-center w-full h-[400px] border-2 border-dashed rounded-lg cursor-pointer bg-light dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                          </svg>
                          <p class="text-xs text-gray-500 dark:text-gray-400">Profile Pic</p>
                      </div>
                      <input id="profile_pic" type="file" class="hidden" accept="image/*" name="profile_pic"
                          onchange="imageSelection(this,'updateCustomer')" />
                      <button id="remove-image"
                          class="absolute top-0 right-0 mt-2 mr-2 hidden text-gray-500 dark:text-gray-400 bg-transparent border-none">
                          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd"
                                  d="M14.293 5.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 1 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 1 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 1 1 1.414-1.414L10 8.586l4.293-4.293z"
                                  clip-rule="evenodd" />
                          </svg>
                      </button>
                      <div class="w-full  h-full absolute top-0 left-0 rounded-md overflow-hidden backdrop-blur-sm">
                          <img id="image-preview" dataBound="profile_pic" alt="Profile Picture"
                              class="w-full h-full object-cover">
                          <div
                              class="absolute bottom-0 flex flex-col justify-center  items-center w-full bg-gradient-to-t from-black to-[rgba(0,0,0,.3)]  h-full p-5 backdrop-blur-[1px]">
                              <p class="text-gray-100 text-xl font-bold">Click To Change Pic</p>
                          </div>
                      </div>
                  </label>
              </div>
          </div>
          <div class="w-2/3 ml-4">
              <div class="flex items-center mb-2">
                  <label for="name" class="text-md font-medium mr-2 w-[80px] text-left text-dark">Name</label>
                  <input type="text" id="name" name="name" placeholder="your name"
                      class="flex-grow rounded border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-blue mr-2"
                      Validation="require multi_word" oninput="Validation.isValid(this)">
              </div>
              <div class="flex items-center mb-2">
                  <label for="state" class="text-md font-medium mr-2 w-[80px] text-left text-dark">State</label>
                  <select name="state" id="state"
                      class="state flex-grow rounded border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-blue mr-2"></select>
              </div>
              <div class="flex items-center mb-2">
                  <label for="city" class="text-md font-medium mr-2 w-[80px] text-left text-dark">City</label>
                  <select name="city" id="city"
                      class="city flex-grow rounded border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-blue mr-2"></select>
              </div>
              <div class="flex items-center mb-2">
                  <label for="area" class="text-md font-medium mr-2 w-[80px] text-left text-dark">Area</label>
                  <input type="text" id="area" name="area" placeholder="area.."
                      class="flex-grow rounded border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-blue mr-2"
                      Validation="require" oninput="Validation.isValid(this)">
              </div>
              <div class="flex items-center mb-2">
                  <label for="pincode" class="text-md font-medium mr-2 w-[80px] text-left text-dark">Pincode</label>
                  <input type="text" id="pincode" name="pincode" placeholder="657899"
                      class="flex-grow rounded border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-blue mr-2"
                      Validation="require digit6" oninput="Validation.isValid(this)">
              </div>
              <div class="flex mb-2">
                  <label for="bio" class="text-md font-medium mr-2 w-[80px] text-left text-dark">Bio</label>
                  <textarea id="bio" rows="10" name="bio" placeholder="657899"
                      class="flex-grow rounded border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-blue mr-2"
                      Validation="require" oninput="Validation.isValid(this)"></textarea>
              </div>
              <div class="flex justify-end mb-2">
                  <button type="submit"
                      class="text-white bg-gradient-to-r from-[#1b5a92]  via-blue to-[#112e48] hover:bg-gradient-to-br  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-max">Update
                      Profile</button>
              </div>
          </div>
      </div>
  </form>`;
  myFetch();
};
const handleUpdateForm = async (e) => {
  e.preventDefault();
  Validation.allValid = true;
  document.querySelectorAll(`input[Validation]`).forEach((ele) => {
    if (!Validation.isValid(ele)) Validation.allValid = false;
  });
  if (!document.querySelector("#updateCustomer error")) {
    let formData = new FormData(e.target);
    let formProps = Object.fromEntries(formData);
    let fileds = Object.keys(formProps);
    formData = new FormData();
    fileds.forEach((filed) => {
      formData.append(
        filed,
        document.querySelector(`#updateCustomer #${filed}`).value
      );
    });
    formData.delete("profile_pic");
    formData.append(
      "thumbnail",
      document.getElementById("profile_pic").files[0] || ""
    );
    formData.append("userId", localStorage.getItem("userId"));
    formProps = Object.fromEntries(formData);

    let response = await fetch("/customer/profile/update", {
      method: "PUT",
      body: formData,
    });
    response = await response.json();

    toast.show(response.success ? "success" : "error", response.message);
    if (response.success)
      setTimeout(() => {
        location.href = "/customer/profile";
      }, 3000);
  }
};

const myFetch = async () => {
  const userDetails = await callAPI("/userDetails");
  const user = userDetails.user;
  await loadAddress("updateCustomer");
  document.querySelector("#updateCustomer #name").value = user.name;
  document.querySelector("#updateCustomer #bio").value = user.bio || "";
  const address = userDetails.address;
  if (address) {
    document.querySelector("#updateCustomer #state").value = address.stateId;
    await loadCity("updateCustomer");
    document.querySelector("#updateCustomer #city").value = address.cityId;
    document.querySelector("#updateCustomer #area").value = address.area;
    document.querySelector("#updateCustomer #pincode").value = address.pincode;
  }
};
