let garages = [];

const fillGarages = async () => {
  let garageDetails = await callAPI("/owner/garages/getGaragesList");
  garages = garageDetails.garages;
  let garageList = ``;
  let index = 0;
  if (!garages.length) {
    garageList = `
        <div class="w-full h-full flex justify-center items-center flex-col">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:100px;height:100px;fill:#ef4444">
  <path d="M111.98 312.074c-20.571 0-37.307 16.736-37.307 37.307 0 20.57 16.736 37.305 37.307 37.305s37.306-16.735 37.306-37.305c.001-20.571-16.734-37.307-37.306-37.307zm0 59.586c-12.286 0-22.28-9.994-22.28-22.278 0-12.286 9.995-22.28 22.28-22.28s22.279 9.995 22.279 22.28c.001 12.284-9.994 22.278-22.279 22.278zM398.67 312.074c-20.571 0-37.306 16.736-37.306 37.307 0 20.57 16.735 37.305 37.306 37.305 20.571 0 37.306-16.735 37.306-37.305 0-20.571-16.735-37.307-37.306-37.307zm0 59.586c-12.285 0-22.279-9.994-22.279-22.278 0-12.286 9.995-22.28 22.279-22.28s22.279 9.995 22.279 22.28c0 12.284-9.994 22.278-22.279 22.278zM322.948 379.664H188.991c-4.15 0-7.514 3.363-7.514 7.514s3.363 7.514 7.514 7.514h133.958c4.15 0 7.514-3.363 7.514-7.514s-3.364-7.514-7.515-7.514zM322.948 351.65H188.991c-4.15 0-7.514 3.363-7.514 7.514s3.363 7.514 7.514 7.514h133.958c4.15 0 7.514-3.363 7.514-7.514s-3.364-7.514-7.515-7.514z"/><path d="M512 250.916c0-19.976-16.252-36.228-36.229-36.228-24.388 0-42.006 23.827-34.512 47.246l-16.197 10.187a166.008 166.008 0 0 0-13.56-60.142h35.206c27.54 0 44.248-28.659 29.44-50.402l-61.071-98.208a7.514 7.514 0 1 0-12.761 7.937c65.793 105.801 64.29 100.883 64.29 107.931 0 9.769-8.926 17.716-19.897 17.716H266.513c-14.595 0-24.224-13.509-18.031-25.229.453-.858-1.231 1.897 29.367-47.307l.003-.006L339.19 25.77c7.536-12.13 27.262-12.136 34.81.003l15.132 24.335a7.512 7.512 0 0 0 10.349 2.412 7.514 7.514 0 0 0 2.412-10.349l-15.132-24.334C380.545 7.841 368.985 1.63 356.594 1.63c-12.395 0-23.954 6.211-30.165 16.207l-58.993 94.867c-5.236-.239-6.66-.195-16.317-.195-89.035 0-161.84 70.762-165.162 158.997l-15.216-9.57a36.105 36.105 0 0 0 1.718-11.019c0-19.976-16.252-36.228-36.229-36.228S0 230.94 0 250.916c0 33.223 41.205 48.838 63.273 24.074l13.51 8.497c-18.661 7.78-32.19 25.457-34.013 46.438h-4.605c-12.969 0-23.521 10.552-23.521 23.521v26.68c0 12.97 10.552 23.522 23.521 23.522h4.381v6.953c-10.062 2.416-17.565 11.483-17.565 22.276 0 12.633 10.279 22.911 22.912 22.911h19.554v31.059c0 12.969 10.552 23.521 23.521 23.521h48.025c12.969 0 23.521-10.551 23.521-23.521v-4.016l36.949-27.043h112.068l36.948 27.043v4.016c0 12.969 10.552 23.521 23.521 23.521h48.025c12.969 0 23.521-10.551 23.521-23.521V455.79H463.1c12.634 0 22.912-10.279 22.912-22.911 0-10.792-7.503-19.86-17.565-22.276v-6.953h4.592c12.969 0 23.521-10.552 23.521-23.522v-26.679c0-12.969-10.552-23.521-23.521-23.521h-4.817c-1.804-20.756-15.063-38.278-33.413-46.184l13.915-8.752c22.11 24.807 63.276 9.095 63.276-24.076zM36.229 272.12c-11.691 0-21.202-9.511-21.202-21.203 0-11.69 9.511-21.201 21.202-21.201s21.202 9.511 21.202 21.201c.001 11.691-9.511 21.203-21.202 21.203zm373.912 7.114h-19.932c-.098-24.043-6.58-47.015-18.854-67.254h23.629c9.981 20.475 15.157 42.669 15.157 67.254zm-82.069 15.088-9.696 29.381H192.617l-9.695-29.381h145.15zm-61.561-82.342h86.863c14.18 19.684 21.704 42.847 21.817 67.254h-239.39c.277-57.629 43.589-106.202 99.358-114.464-11.644 22.16 6.094 47.21 31.352 47.21zm-15.393-84.444h7.094l-13.159 21.161c-69.055 3.627-123.984 60.514-124.274 130.537h-19.927c0-86.833 69.398-151.698 150.266-151.698zM38.165 388.624c-4.684 0-8.494-3.812-8.494-8.495v-26.68c0-4.684 3.811-8.494 8.494-8.494h4.381v43.671h-4.381v-.002zm109.323 98.226c0 4.683-3.811 8.494-8.494 8.494H90.969c-4.684 0-8.494-3.811-8.494-8.494v-31.059h65.013v31.059zm15.027-22.637v-8.421h11.506l-11.506 8.421zm174.458-8.422h11.505v8.42l-11.505-8.42zm91.547 31.059c0 4.683-3.811 8.494-8.494 8.494h-48.025c-4.684 0-8.494-3.811-8.494-8.494v-31.058h65.013v31.058zm53.016-133.402v26.68c0 4.684-3.811 8.495-8.494 8.495h-4.592v-43.671h4.592c4.683.002 8.494 3.812 8.494 8.496zm-28.115-18.675v75.196H98.604c-4.15 0-7.514 3.363-7.514 7.514s3.363 7.514 7.514 7.514h364.498c4.348 0 7.885 3.537 7.885 7.885s-3.537 7.884-7.885 7.884H47.893c-4.348 0-7.885-3.536-7.885-7.884 0-4.348 3.537-7.885 7.885-7.885h24.663c4.15 0 7.514-3.363 7.514-7.514s-3.363-7.514-7.514-7.514H57.573c0-13.991.212-13.83.212-13.83 0-63.072-.212-61.366-.212-61.366 0-22.337 18.174-40.511 40.51-40.511 4.922 0 64.092.06 69.014.06l12.952 39.25a7.513 7.513 0 0 0 7.135 5.158H323.81a7.515 7.515 0 0 0 7.135-5.158l12.952-39.25c.352 0 40.487.041 40.845-.06h27.739c23.415 0 40.94 18.679 40.94 40.511zm22.35-105.058c11.691 0 21.202 9.511 21.202 21.201 0 11.692-9.511 21.203-21.202 21.203-11.692 0-21.203-9.511-21.203-21.203-.001-11.69 9.511-21.201 21.203-21.201z"/><path d="M347.695 31.066 258.176 175.02c-2.322 3.735-.952 8.668 2.972 10.664 3.515 1.791-8.75 1.251 185.678 1.251 8.21-.078 11.197-7.073 8.194-11.905L365.493 31.063c-3.672-5.857-14.188-5.814-17.798.003zm-69.887 140.842 78.788-126.696 78.788 126.696H277.808z"/><path d="M361.523 145.668h-9.849a2.505 2.505 0 0 0-2.505 2.505v8.238a2.505 2.505 0 0 0 2.505 2.505h9.849a2.504 2.504 0 0 0 2.505-2.505v-8.238a2.506 2.506 0 0 0-2.505-2.505zM349.169 91.433v45.305a2.505 2.505 0 0 0 2.505 2.505h9.849a2.504 2.504 0 0 0 2.505-2.505V91.433a2.505 2.505 0 0 0-2.505-2.505h-9.849a2.504 2.504 0 0 0-2.505 2.505z"/></svg>
        <h2 class="text-[#ef4444] font-bold text-2xl">Oops..!!</h2><p class="text-[#ef4444]"><b> No garage found...!!!</b></p>
  </div>
        `;
    document
      .querySelectorAll("#services,#slots,#appointment")
      .forEach((panel) => {
        panel.style.display = "none";
      });
  } else {
    garages.forEach((garage) => {
      garageList +=
        `
      <div class="w-1/3 p-2 h-[600px] relative">
      <div class="absolute top-0 right-0 flex items-center mr-4 mt-4 bg-dark rounded-full" onmouseover="showEditBox(${index + 1
        })" onmouseout="hideEditBox(${index + 1})">
        <button type="button" class="h-full w-full"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:white;transform: ;msFilter:;"><path d="M10   10h4v4h-4zm0-6h4v4h-4zm0 12h4v4h-4z"></path>
            </svg>
        </button>
      </div>
      <div class="absolute top-3 right-5 z-10 items-center mr-4 mt-4 hidden" id="editBox${index + 1
        }" onmouseover="showEditBox(${index + 1})" onmouseout="hideEditBox(${index + 1
        })">
        <div class="bg-light p-3 rounded-xl text-left">
          <p class="flex hover:cursor-pointer" onClick="editGarage(${index})"><img src="/icons/edit.svg" class="h-4 mt-1 mr-2">Edit</img></p>
          <p class="flex mt-2 hover:cursor-pointer" onClick="deleteGarage(${garage.garage_id
        } ` +
        `,` +
        `'${garage.garage_name
        }')"><img src="/icons/delete.svg" class="h-4 mt-1 mr-2">Delete</img></p>
        </div>
      </div>
      <div class="w-full h-full border border-gray-200 rounded-lg shadow" id='${garage.id
        }'>
      <a href="#" class="mb-4">
          <img class="rounded-t-lg w-full h-[280px]" src="/uploads/${garage.thumbnail
        }" onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeUyb754vebKqfbxScXd11wIOQGyxRlNNQBv31JG4wC9ytLmJgMP3i__68EPQpIN3vrPk&usqp=CAU'" />
      </a>
      <div class="p-5">
          <div class="flex justify-between mb-2">
              <h5 class="mb-2 text-2xl font-bold tracking-wide text-dark ">${garage.garage_name
        }</h5>
              <tag class="${garage.status ? "bg-[#038117]" : "bg-[#ff5f5f]"
        } w-max h-max px-4 py-[6px] rounded-xl text-white tracking-wide">${garage.status ? "OPEN" : "CLOSE"
        }</tag>
          </div>
          <div class="flex items-center mt-2">
              <icon class="bg-dark p-1 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;">
                      <path
                          d="M20 4H6c-1.103 0-2 .897-2 2v5h2V8l6.4 4.8a1.001 1.001 0 0 0 1.2 0L20 8v9h-8v2h8c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-7 6.75L6.666 6h12.668L13 10.75z">
                      </path>
                      <path d="M2 12h7v2H2zm2 3h6v2H4zm3 3h4v2H7z"></path>
                  </svg>
              </icon>
              <p class="text-dark font-semibold text-sm">${garage.email}</p>
          </div>
          <div class="flex items-center mt-2">
              <icon class="bg-dark p-1 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;">
                      <path
                          d="M16.57 22a2 2 0 0 0 1.43-.59l2.71-2.71a1 1 0 0 0 0-1.41l-4-4a1 1 0 0 0-1.41 0l-1.6 1.59a7.55 7.55 0 0 1-3-1.59 7.62 7.62 0 0 1-1.59-3l1.59-1.6a1 1 0 0 0 0-1.41l-4-4a1 1 0 0 0-1.41 0L2.59 6A2 2 0 0 0 2 7.43 15.28 15.28 0 0 0 6.3 17.7 15.28 15.28 0 0 0 16.57 22zM6 5.41 8.59 8 7.3 9.29a1 1 0 0 0-.3.91 10.12 10.12 0 0 0 2.3 4.5 10.08 10.08 0 0 0 4.5 2.3 1 1 0 0 0 .91-.27L16 15.41 18.59 18l-2 2a13.28 13.28 0 0 1-8.87-3.71A13.28 13.28 0 0 1 4 7.41zM20 11h2a8.81 8.81 0 0 0-9-9v2a6.77 6.77 0 0 1 7 7z">
                      </path>
                      <path d="M13 8c2.1 0 3 .9 3 3h2c0-3.22-1.78-5-5-5z"></path>
                  </svg>
              </icon>
              <p class="text-dark font-semibold text-sm">+91 ${garage.contact_number
        }</p>
          </div>
          <div class="flex items-center mt-2">
              <icon class="bg-dark p-1 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;">
                      <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
                      <path
                          d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z">
                      </path>
                  </svg>
              </icon>
              <p class="text-dark font-semibold text-sm">${formatTimeAMPM(
          garage.open_time.split(" ")[1]
        )} to ${formatTimeAMPM(garage.close_time.split(" ")[1])}</p>
          </div>
          <div class="flex mt-2">
              <icon class="bg-dark p-1 rounded-full mr-2 h-max">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25"
                      viewBox="0,0,256,256">
                      <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                          stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                          font-family="none" font-weight="none" font-size="none" text-anchor="none"
                          style="mix-blend-mode: normal">
                          <g transform="scale(5.12,5.12)">
                              <path
                                  d="M25,2c-12.6907,0 -23,10.3093 -23,23c0,12.69071 10.3093,23 23,23c12.69071,0 23,-10.30929 23,-23c0,-12.6907 -10.30929,-23 -23,-23zM25,4c11.60982,0 21,9.39018 21,21c0,11.60982 -9.39018,21 -21,21c-11.60982,0 -21,-9.39018 -21,-21c0,-11.60982 9.39018,-21 21,-21zM25,11c-1.65685,0 -3,1.34315 -3,3c0,1.65685 1.34315,3 3,3c1.65685,0 3,-1.34315 3,-3c0,-1.65685 -1.34315,-3 -3,-3zM21,21v2h1h1v13h-1h-1v2h1h1h4h1h1v-2h-1h-1v-15h-1h-4z">
                              </path>
                          </g>
                      </g>
                  </svg>
              </icon>
              <p class="text-dark font-semibold text-justify tracking-tight text-sm">${garage.description?.substring(0, 150) || ""
        }...</p>
          </div>

      </div>
  </div>
  </div>
      `;
      index++;
    });
  }
  document.getElementById("garage-container").innerHTML = garageList;
};

const showEditBox = (id) => {
  document.getElementById(`editBox${id}`).style.display = "flex";
};

const hideEditBox = (id) => {
  document.getElementById(`editBox${id}`).style.display = "none";
};

const deleteGarage = (garageId, garageName) => {
  Swal.fire({
    title: "Are you sure?",
    text: `really you want to delete ${garageName} garage???`,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
    icon: "question",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let response = await callAPI(
        `/owner/garages/delete/${garageId}`,
        {},
        "DELETE"
      );
      toast.show(response.success ? "success" : "error", response.message);
      if (response.success) {
        setTimeout(() => {
          location.href = "/owner/garages";
        }, 1500);
      }
    }
  });
};
