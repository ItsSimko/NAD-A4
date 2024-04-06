console.log("hello from detail.js");

const backButton = document.getElementById("back-btn");
const updateBtn = document.getElementById("update-btn");
const deleteBtn = document.getElementById("delete-btn");
const postBox = document.getElementById("post-box");
const spinnerBox = document.getElementById("spinnerBox");

const url = window.location.href + "data/";
const updateUrl = window.location.href + "update/";
const deleteUrl = window.location.href + "delete/";

const updateForm = document.getElementById("update-form");
const deleteForm = document.getElementById("delete-form");

const titleInput = document.getElementById("id_title");
const bodyInput = document.getElementById("id_body");

const csrf = document.getElementsByName("csrfmiddlewaretoken");

backButton.addEventListener("click", () => {
  window.history.back();
});

$.ajax({
  type: "GET",
  url: `${url}`,
  success: function (response) {
    const data = response.data;
    console.log(data);
    if (data.logged_in !== data.author) {
      updateBtn.classList.add("not-visible");
      deleteBtn.classList.add("not-visible");
    } else {
      updateBtn.classList.remove("not-visible");
      deleteBtn.classList.remove("not-visible");
    }

    const titleEl = document.createElement("h3");
    titleEl.setAttribute("class", "mt-2");
    titleEl.setAttribute("id", "post-title");

    const bodyEl = document.createElement("p");
    bodyEl.setAttribute("class", "mt-1");
    bodyEl.setAttribute("id", "post-body");

    titleEl.textContent = data.title;
    bodyEl.textContent = data.body;

    postBox.appendChild(titleEl);
    postBox.appendChild(bodyEl);

    titleInput.value = data.title;
    bodyInput.value = data.body;
    spinnerBox.classList.add("not-visible");
  },
  error: function (error) {
    console.log(error);
  },
});

updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const titleForm = document.getElementById("post-title");
  const bodyForm = document.getElementById("post-body");

  $.ajax({
    type: "POST",
    url: `${updateUrl}`,
    data: {
      csrfmiddlewaretoken: csrf[0].value,
      title: titleInput.value,
      body: bodyInput.value,
    },
    success: function (response) {
      titleForm.textContent = response.title;
      bodyForm.textContent = response.body;
    },
    error: function (error) {
      console.log(error);
    },
  });
});

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: `${deleteUrl}`,
    data: {
      csrfmiddlewaretoken: csrf[0].value,
    },
    success: function (response) {
      console.log(response);
      window.location.href = window.location.origin;
      localStorage.setItem("title", response.title);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
