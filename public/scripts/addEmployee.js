var garageData;
const handleEmployeeAddForm = async (e) => {
  e.preventDefault();
  Validation.allValid = true;
  document.querySelectorAll(`input[Validation]`).forEach((ele) => {
    if (!Validation.isValid(ele)) Validation.allValid = false;
  });
  if (!document.querySelector("#addEmployee error")) {
    let formData = new FormData(e.target);
    let formProps = Object.fromEntries(formData);
    let fileds = Object.keys(formProps);

    formData = new FormData();
    fileds.forEach((filed) => {
      formData.append(
        filed,
        document.querySelector(`#addEmployee #${filed}`).value
      );
    });
    formData.delete(`${e.target.id}-thumbnail`);
    formData.append(
      "thumbnail",
      document.getElementById(`${e.target.id}-thumbnail`).files[0] || ""
    );

    formData.append("userId", localStorage.getItem("userId"));
    formProps = Object.fromEntries(formData);
  }
};

const getGaragesForEmployee = async (id) => {
  garageData = await fetch("/owner/garages/getGaragesList");
  garageData = await garageData.json();
  var dropdown = document.querySelector("#" + id);
  garageData.garages.forEach((element) => {
    var option = document.createElement("option");
    option.setAttribute("value", element.garage_name);
    option.classList.add("font-family");
    option.classList.add("options");
    option.innerText = element.garage_name;
    option.value = element.garage_id;
    dropdown.appendChild(option);
  });
};

getGaragesForEmployee("garageForEmployeeAdd");
getGaragesForEmployee("garagesDropdownForEmployee");

const getStateAndCity = async () => {
  await loadAddress("addEmployee");
  await loadCity("addEmployee");
};
getStateAndCity();
