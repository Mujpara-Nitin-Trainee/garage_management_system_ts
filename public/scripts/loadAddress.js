const loadCity = async (form) => {
  let stateId = document.querySelector(`#${form} .state`).selectedOptions[0].id;
  let city = document.querySelector(`#${form} .city`);
  let response = await callAPI(`/address/city/${stateId}`);
  let cityOption = ``;
  response.city.forEach((city) => {
    cityOption += `<option id='${city.id}' name='${city.id}' value='${city.id}'>${city.city_name}</option>`;
  });
  city.innerHTML = "";
  city.innerHTML = cityOption;
};
const loadAddress = async (form) => {
  let state = document.querySelector(`#${form} .state`);
  state.addEventListener("change", () => loadCity(form));
  let response = await callAPI("/address/state");
  let stateOption = `<option selected disabled>--select state--</option>`;
  response.state.forEach((state) => {
    stateOption += `<option id='${state.id}' name='${state.id}' value='${state.id}'>${state.state_name}</option>`;
  });
  state.innerHTML = stateOption;
};
