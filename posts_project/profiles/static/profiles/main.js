const avatarBox = document.getElementById("avatar-box");
const profileForm = document.getElementById("profile-form");
const csrf = document.getElementsByName("csrfmiddlewaretoken");
const alertBox = document.getElementById("alert-box");

const bioInput = document.getElementById("id_bio");
const avatarInput = document.getElementById("id_avatar");

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("csrfmiddlewaretoken", csrf[0].value);
  formData.append("bio", bioInput.value);
  formData.append("avatar", avatarInput.files[0]);

  $.ajax({
    type: "POST",
    url: "",
    data: formData,
    enctype: "multipart/form-data",
    success: function (response) {
      handleAlerts("success", "Profile updated successfully");
      avatarBox.innerHTML = `
                <img src="${response.avatar}" class="rounded-circle" height="100px" width="100px">
            `;
      bioInput.value = response.bioInput;
    },
    error: function (error) {
      handleAlerts("danger", "An error occurred");
    },
    processData: false,
    contentType: false,
    cache: false,
  });
});
