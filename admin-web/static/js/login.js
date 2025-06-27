const form = document.querySelector("form");
const btn = document.getElementById("login-btn");
const btnText = document.getElementById("btn-text");
const spinner = document.getElementById("spinner");

form.addEventListener("submit", () => {
  btn.disabled = true;
  btn.classList.remove("bg-green-500");
  btn.classList.add("validating");
  btnText.textContent = "Validando datos...";
  spinner.classList.remove("hidden");
});