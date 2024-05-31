const Validation = {
  allValid: true,
  conditions: {
    require: (value) =>
      !value.length || value.trim() == ""
        ? { errorMessage: "field is require..", valid: false }
        : { valid: true },
    alpha: (value) =>
      !/^[a-z]+$/i.test(value)
        ? { errorMessage: "only alphabet is allowed..", valid: false }
        : { valid: true },
    length8: (value) =>
      value.length < 8
        ? {
          errorMessage: "password must be at least 8 character..",
          valid: false,
        }
        : { valid: true },
    digit10: (value) =>
      !/^\d{10}$/.test(value)
        ? { errorMessage: "only 10 digit allowed..", valid: false }
        : { valid: true },
    digit6: (value) =>
      !/^\d{6}$/.test(value)
        ? { errorMessage: "only 6 digit allowed..", valid: false }
        : { valid: true },
    year: (value) => {
      return !(value >= 1970 && value <= new Date().getFullYear())
        ? { errorMessage: "invalid year..", valid: false }
        : { valid: true };
    },
    mobile: (value) =>
      !/^[6789]{1,}/.test(value)
        ? { errorMessage: "mobile number start with 6,7,8,9..", valid: false }
        : { valid: true },
    multi_word: (value) =>
      !/^[a-zA-Z_ ]*$/.test(value)
        ? { errorMessage: "invalid data format..", valid: false }
        : { valid: true },
    email: (value) =>
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? { errorMessage: "invalid email address..", valid: false }
        : { valid: true },
    match: (value) => {
      return document.querySelector("#password").value != value
        ? { errorMessage: "password not match...", valid: false }
        : { valid: true };
    },
    bank_card: (value) => {
      return !(
        /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
          value
        ) ||
        /^4[0-9]{12}(?:[0-9]{3})?$/.test(value) ||
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/.test(value)
      )
        ? { errorMessage: "Invalid card..", valid: false }
        : { valid: true };
    },
    card_year: (value) => {
      return !/^((0?[1-9]|1[0-2])-\d{4})$/.test(value)
        ? { errorMessage: "Invalid card expiry date..", valid: false }
        : { valid: true };
    },
    digit3: (value) =>
      !/^\d{3}$/.test(value)
        ? { errorMessage: "only 3 digit allowed..", valid: false }
        : { valid: true },
    none: () => {
      return { valid: true };
    },
  },
  isValid: (control) => {
    let validateControls = {};
    control
      .getAttribute("validation")
      .split(" ")
      ?.forEach((validCondition) => {
        if (
          validateControls[control.id]?.valid == undefined ||
          validateControls[control.id]?.valid ||
          validateControls[control.id] === undefined
        ) {
          validateControls[control.name] = Validation.conditions[
            validCondition
          ](control.value);
          if (control.nextSibling != null) {
            control.nextSibling.remove();
          }
          if (validateControls[control.name].errorMessage != undefined) {
            Validation.allValid = false;
            let errorElement = document.createElement("error");
            errorElement.innerText =
              validateControls[control.name].errorMessage;
            control.insertAdjacentElement("afterend", errorElement);
          } else control.nextSibling?.remove();
        }
      });
    Validation.allValid = document.querySelector("error") == null;
  },
  validateAll: async (formId, form) => {
    document.querySelectorAll(`input[validation]`).forEach((ele) => {
      Validation.isValid(ele);
    });
    if (Validation.allValid) {
      const formData = new FormData(document.querySelector(`#${formId}`));
      const formProps = Object.fromEntries(formData);
      if (form == "u/register")
        formProps["role_id"] = document.querySelector(
          "input[type=radio]:checked"
        ).value;
      if (form == "u/resetPassword") {
        let href = location.pathname;
        href = href.slice(href.lastIndexOf("/") + 1);
        formProps["email"] = href;
      }
      let response = await fetch(`/${form}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formProps),
      });
      let data = 0;
      try {
        data = await response.json();
        if (data.success) {
          if (form == "u/login") {
            Swal.fire({
              title: "Good job!",
              text: "Welcome To Your Dashboard",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
              allowOutsideClick: false,
            });
            localStorage.setItem("userId", data.userId);
            setTimeout(() => {
              if (data.role_id == "1") location.pathname = "/owner/home";
              else location.pathname = "/customer/home";
            }, 1500);
          } else if (form == "u/register") {
            const activate = document.getElementById("activate");
            let href = document.createElement("a");
            let text = `${location.origin}/u/activate/${data.userId.insertId}/${data.token}`;
            href.setAttribute("href", text);
            href.append(text);
            activate.appendChild(href);
          } else if (form == "u/forgotPassword") {
            const activate = document.getElementById("activate");
            let href = document.createElement("a");
            let text = `${location.origin}/u/resetPassword/${data.email}`;
            href.setAttribute("href", text);
            href.append(text);
            activate.appendChild(href);
          } else if (form == "u/resetPassword") {
            Swal.fire({
              title: "Good job!",
              text: "Password Updated successfully",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
              allowOutsideClick: false,
            });
            setTimeout(() => {
              location.pathname = "u/signIn";
            }, 1500);
          }
        } else {
          throw data.message;
        }
      } catch (error) {
        if (error == undefined) {
          error = "Something wen't wrong..!!";
        }
        toast.show("error", error);
      }
    }
  },
  setDefault: () => {
    document.querySelectorAll(`error`).forEach((ele) => {
      ele.remove();
    });
  },
};

// ==========================
// const Validation = {
//   conditions: {
//     require: (value) => {
//       if (!value.trim()) {
//         return { errorMessage: "Field is required", valid: false };
//       }
//       return { valid: true };
//     },
//     alpha: (value) => {
//       if (!/^[a-z]+$/i.test(value)) {
//         return { errorMessage: "Only alphabet is allowed", valid: false };
//       }
//       return { valid: true };
//     },
//     length8: (value) => {
//       if (value.length < 8) {
//         return { errorMessage: "Password must be at least 8 characters", valid: false };
//       }
//       return { valid: true };
//     },
//     digit10: (value) => {
//       if (!/^\d{10}$/.test(value)) {
//         return { errorMessage: "Only 10 digits allowed", valid: false };
//       }
//       return { valid: true };
//     },
//     digit6: (value) => {
//       if (!/^\d{6}$/.test(value)) {
//         return { errorMessage: "Only 6 digits allowed", valid: false };
//       }
//       return { valid: true };
//     },
//     mobile: (value) => {
//       if (!/^[6789]/.test(value)) {
//         return { errorMessage: "Mobile number must start with 6, 7, 8, or 9", valid: false };
//       }
//       return { valid: true };
//     },
//     multi_word: (value) => {
//       if (!/^[a-zA-Z_ ]*$/.test(value)) {
//         return { errorMessage: "Invalid data format", valid: false };
//       }
//       return { valid: true };
//     },
//     email: (value) => {
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//         return { errorMessage: "Invalid email address", valid: false };
//       }
//       return { valid: true };
//     },
//     match: () => ({ valid: true }),
//     none: () => ({ valid: true }),
//   },

//   isValid: (control) => {
//     let isValid = true;
//     control.getAttribute("validation").split(" ").forEach((validCondition) => {
//       const validationResult = Validation.conditions[validCondition](control.value);
//       if (!validationResult.valid) {
//         isValid = false;
//         Validation.showError(control, validationResult.errorMessage);
//       }
//     });
//     return isValid;
//   },

//   showError: (control, errorMessage) => {
//     Validation.clearError(control);
//     const errorElement = document.createElement("error");
//     errorElement.innerText = errorMessage;
//     control.insertAdjacentElement("afterend", errorElement);
//   },

//   clearError: (control) => {
//     const nextSibling = control.nextSibling;
//     if (nextSibling && nextSibling.tagName === "ERROR") {
//       nextSibling.remove();
//     }
//   },

//   validateAll: async (e, form) => {
//     e.preventDefault();
//     const formControls = document.querySelectorAll(`input[validation]`);
//     let isValid = true;

//     formControls.forEach((control) => {
//       if (!Validation.isValid(control)) {
//         isValid = false;
//       }
//     });

//     if (isValid) {
//       try {
//         const formData = new FormData(e.target);
//         const formProps = Object.fromEntries(formData);
//         let response = await fetch(`/${form}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formProps),
//         });

//         let data = await response.json();
//         if (data.success) {
//           handleSuccess(data, form);
//         } else {
//           throw data.message;
//         }
//       } catch (error) {
//         handleError(error);
//       }
//     }
//   },
// };

// const handleSuccess = (data, form) => {
//   const btn = document.querySelector(`input[type=submit]`);
//   btn.setAttribute("disabled", "");
//   btn.innerHTML = `<img src="https://i.gifer.com/ZKZg.gif" height="20px" />`;

//   if (form === "u/login") {
//     handleLoginSuccess(data);
//   } else if (form === "u/register") {
//     handleRegisterSuccess(data);
//   } else if (form === "u/forgotPassword") {
//     handleForgotPasswordSuccess(data);
//   } else if (form === "u/resetPassword") {
//     handleResetPasswordSuccess(data);
//   }
// };

// const handleLoginSuccess = (data) => {
//   Swal.fire({
//     title: "Good job!",
//     text: "Welcome To Your Dashboard",
//     icon: "success",
//     showConfirmButton: false,
//     timer: 1500,
//     allowOutsideClick: false,
//   });
//   localStorage.setItem("userId", data.userId);
//   setTimeout(() => {
//     if (data.role_id === "1") {
//       location.pathname = "/owner/home";
//     } else {
//       location.pathname = "/customer/home";
//     }
//   }, 1500);
// };

// const handleRegisterSuccess = (data) => {
//   const activate = document.getElementById("activate");
//   let href = document.createElement("a");
//   let text = `${location.origin}/u/activate/${data.userId}/${data.token}`;
//   href.setAttribute("href", text);
//   href.append(text);
//   activate.innerHTML = href;
// };

// const handleForgotPasswordSuccess = (data) => {
//   const activate = document.getElementById("activate");
//   let href = document.createElement("a");
//   let text = `${location.origin}/u/resetPassword/${data.email}`;
//   href.setAttribute("href", text);
//   href.append(text);
//   activate.innerHTML = href;
// };

// const handleResetPasswordSuccess = () => {
//   Swal.fire({
//     title: "Good job!",
//     text: "Password Updated successfully",
//     icon: "success",
//     showConfirmButton: false,
//     timer: 1500,
//     allowOutsideClick: false,
//   });
//   setTimeout(() => {
//     location.pathname = "u/signIn";
//   }, 1500);
// };

// const handleError = (error) => {
//   if (!error) {
//     error = "Something went wrong..!!";
//   }
//   toast.show("error", error);
// };
