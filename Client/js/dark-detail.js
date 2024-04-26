const btn = document.querySelector(".btn");
const theme = document.querySelector("#theme-link");

// Lắng nghe sự kiện click vào button
btn.addEventListener("click", function() {
  // Nếu URL đang là "ligh-theme.css"
  if (theme.getAttribute("href") == "../assets/css/detail.css") {
    // thì chuyển nó sang "dark-theme.css"
    theme.href = "../assets/css/detail-dark.css";
  } else {
    // và ngược lại
    theme.href = "../assets/css/detail.css";
  }
});
