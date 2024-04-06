const postBox = document.getElementById("posts-body");
const spinnerBox = document.getElementById("spinnerBox");
const loadBtn = document.getElementById("load-btn");
const endBox = document.getElementById("end-box");

const postForm = document.getElementById("post-form");
const title = document.getElementById("id_title");
const body = document.getElementById("id_body");
const alertBox = document.getElementById("alert-box");
const csrf = document.getElementsByName("csrfmiddlewaretoken");

const url = window.location.href;

let visible = 3;

const getDatas = () => {
  $.ajax({
    type: "GET",
    url: `getPosts/${visible}`,
    success: function (response) {
      const data = response.data;

      console.log("hello");
      console.log(data);
      console.log(response.size);

      setTimeout(() => {
        spinnerBox.classList.add("not-visible");
        spinnerBox.classList.add("not-visible");
        data.forEach((el) => {
          postBox.innerHTML += `
            <div class="card mb-2">
                <div class="card-body">
                    <h5 class="card-title">${el.title}</h5>
                    <p class="card-text">${el.body}</p>
                </div>
                <div clas="card-footer">
                <div class="row">
                <div class="col-1">
                    <a href="${url}${el.id}" class="btn btn-primary">Details</a>
                </div>
                <div class="col">
                    <form class="unlike-like-form" data-form-id="${el.id}">
                        <button class="btn btn-primary" id="like-unlike-${
                          el.id
                        }">${
                          el.liked
                            ? `Unlike (${el.like_count})`
                            : `Like (${el.like_count})`
                        }</button>
                    </form>

                </div>
                    
                </div>
                    
                </div>
            </div>
            `;
        });
        likeUnlikePosts();
      }, 250);

      if (response.size === 0) {
        endBox.textContent = "No created posts to show";
      } else if (response.size <= visible) {
        loadBtn.classList.add("not-visible");
        endBox.textContent = "No more posts to show";
      } else {
        loadBtn.classList.remove("not-visible");
      }
    },
    error: function (e) {
      console.log("error", e);
    },
  });
};

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

const csrftoken = getCookie("csrftoken");

const likeUnlikePosts = () => {
  const likeUnlikePosts = [...document.querySelectorAll(".unlike-like-form")];
  likeUnlikePosts.forEach((el) => {
    el.addEventListener("submit", (e) => {
      e.preventDefault();
      const clickedId = el.getAttribute("data-form-id");
      const clickedBtn = document.getElementById(`like-unlike-${clickedId}`);
      $.ajax({
        type: "POST",
        url: "like-unlike/",
        data: {
          csrfmiddlewaretoken: csrftoken,
          pk: clickedId,
        },
        success: function (response) {
          clickedBtn.textContent = response.liked
            ? `Unlike (${response.count})`
            : `Like (${response.count})`;
        },
        error: function (e) {},
      });
    });
  });
};

loadBtn.addEventListener("click", () => {
  spinnerBox.classList.remove("not-visible");
  visible += 3;
  getDatas();
});

const addBtn = document.getElementById("add-btn");
const closeClass = [...document.getElementsByClassName("add-modal-close")];
const dropzone = document.getElementById("dropzone");

postForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $.ajax({
    type: "POST",
    url: "",
    data: {
      csrfmiddlewaretoken: csrf[0].value,
      title: title.value,
      body: body.value,
    },
    success: function (response) {
      console.log("s", response);
      postBox.insertAdjacentHTML(
        `afterbegin`,
        `
      <div class="card mb-2">
                <div class="card-body">
                    <h5 class="card-title">${response.title}</h5>
                    <p class="card-text">${response.body}</p>
                </div>
                <div clas="card-footer">
                    <div class="row">
                        <div class="col-1">
                            <a href="${url}${response.id}" class="btn btn-primary">Details</a>
                        </div>
                        <div class="col">
                            <form class="unlike-like-form" data-form-id="${response.id}">
                                <button class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>
                            </form>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
      `
      );
      likeUnlikePosts();
      //$("#addPostModal").modal("hide");

      //getDatas();
      title.value = "";
      body.value = "";

      handleAlerts("success", "Post created successfully");
    },
    error: function (e) {
      console.log("error", e);
      handleAlerts("danger", "Oops, something went wrong!");
    },
  });
});

const deleted = localStorage.getItem("title");

if (deleted) {
  handleAlerts("success", "Post deleted successfully");
  localStorage.removeItem("title");
}

addBtn.addEventListener("click", () => {
  dropzone.classList.remove("not-visible");
});

closeClass.forEach((el) => {
  el.addEventListener("click", () => {
    titleInput.value = "";
    bodyInput.value = "";
    if (dropzone.classList.contains("not-visible"))
      dropzone.classList.add("not-visible");
  });
});

getDatas();
