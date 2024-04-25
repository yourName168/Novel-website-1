const btn = document.querySelector(".btn");
const theme = document.querySelector("#theme-link");

// Lắng nghe sự kiện click vào button
btn.addEventListener("click", function() {
  // Nếu URL đang là "ligh-theme.css"
  if (theme.getAttribute("href") == "style_registerLight.css") {
    // thì chuyển nó sang "dark-theme.css"
    theme.href = "style_registerDark.css";
  } else {
    // và ngược lại
    theme.href = "style_registerLight.css";
  }
});
