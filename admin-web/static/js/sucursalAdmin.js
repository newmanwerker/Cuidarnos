function showTab(tab) {
  const resumenTab = document.getElementById("tabResumen");
  const personalTab = document.getElementById("tabPersonal");
  const resumenContent = document.getElementById("contenidoResumen");
  const personalContent = document.getElementById("contenidoPersonal");

  if (tab === "resumen") {
    resumenTab.classList.add("bg-white", "shadow", "text-gray-900", "border");
    resumenTab.classList.remove("text-gray-500");

    personalTab.classList.remove("bg-white", "shadow", "text-gray-900", "border");
    personalTab.classList.add("text-gray-500");

    resumenContent.classList.remove("hidden");
    personalContent.classList.add("hidden");
  } else {
    personalTab.classList.add("bg-white", "shadow", "text-gray-900", "border");
    personalTab.classList.remove("text-gray-500");

    resumenTab.classList.remove("bg-white", "shadow", "text-gray-900", "border");
    resumenTab.classList.add("text-gray-500");

    personalContent.classList.remove("hidden");
    resumenContent.classList.add("hidden");
  }
}