const imageSelection = (fileControl, form) => {
  const imagePreview = document.querySelector(`#${form} #image-preview`);
  const file = fileControl.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      imagePreview.src = imageUrl;
      imagePreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
};
