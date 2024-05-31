const handleUpdateForm = async (e) => {
  e.preventDefault();
  Validation.allValid = true;
  document.querySelectorAll(`input[Validation]`).forEach((ele) => {
    if (!Validation.isValid(ele)) Validation.allValid = false;
  });
  if (!document.querySelector("#updateOwner error")) {
    let formData = new FormData(e.target);
    let formProps = Object.fromEntries(formData);
    let fileds = Object.keys(formProps);
    formData = new FormData();
    fileds.forEach((filed) => {
      formData.append(
        filed,
        document.querySelector(`#updateOwner #${filed}`).value
      );
    });
    formData.delete("profile_pic");
    formData.append(
      "thumbnail",
      document.getElementById("profile_pic").files[0] || ""
    );
    formData.append("userId", localStorage.getItem("userId"));
    formProps = Object.fromEntries(formData);
    debugger;
    let response = await fetch("/owner/profile/update", {
      method: "PUT",
      body: formData,
    });
    response = await response.json();

    toast.show(response.success ? "success" : "error", response.message);
    if (response.success)
      setTimeout(() => {
        location.href = "/owner/profile";
      }, 3000);
  }
};

const myFetch = async () => {
  const userDetails = await callAPI("/userDetails");
  const user = userDetails.user;
  await loadAddress("updateOwner");
  document.querySelector("#updateOwner #name").value = user.name;
  document.querySelector("#updateOwner #bio").value = user.bio || "";
  const address = userDetails.address;
  if (address) {
    document.querySelector("#updateOwner #state").value = address.stateId;
    await loadCity("updateOwner");
    document.querySelector("#updateOwner #city").value = address.cityId;
    document.querySelector("#updateOwner #area").value = address.area;
    document.querySelector("#updateOwner #pincode").value = address.pincode;
  }
};