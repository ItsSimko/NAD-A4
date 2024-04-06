console.log("Hello World from posts/static/posts/main.js");

const postBox = document.getElementById("posts-body");
const spinnerBox = document.getElementById("spinnerBox");
const loadBtn = document.getElementById("load-btn");
const endBox = document.getElementById("end-box");

let visible = 3;

const getDatas = () => {
  $.ajax({
    type: "GET",
    url: `getPosts/${visible}`,
    success: function (response) {
      const data = response.data;

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
                    <a href="#" class="btn btn-primary">Details</a>
                </div>
                <div class="col">
                    <form class="unlike-like-form" data-form-id="${el.id}">
                        (% csrf_token %)
                        <button href="#" class="btn btn-primary" id="like-unlike-${
                          el.id
                        }></button>
                    </form>

                    <button href="#" class="btn btn-primary">${
                      el.liked
                        ? `Unlike (${el.like_count})`
                        : `Like (${el.like_count})`
                    }</button>
                </div>
                    
                </div>
                    
                </div>
            </div>
            `;
        });
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
    error: function (e) {},
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
  const likeUnlikePosts = { ...document.querySelectorAll(".unlike-like-form") };
  likeUnlikePosts.forEach((el) => {
    el.addEventListener("submit", (e) => {
      e.preventDefault();
      const clickedId = el.target.getAttribute("data-form-id");
      const clieckedBtn = document.getElementById(`#like-unlike-${postId}`);
      $.ajax({
        type: "POST",
        url: "",
        data: {
          "X-CSRFToken": csrftoken,
          postId: postId,
        },
        success: function (response) {
          if (response.liked) {
            el.nextElementSibling.textContent = `Unlike (${response.like_count})`;
          } else {
            el.nextElementSibling.textContent = `Like (${response.like_count})`;
          }
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

getDatas();
