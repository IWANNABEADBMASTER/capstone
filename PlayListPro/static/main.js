var i1 = "접기";

function sel(self, i) {
  if (i === "펼치기") {
    hide(self);
  } else {
    show(self);
  }
}

function hide(self) {
  self.style.display = "none";
}

function show(self) {
  self.style.display = "";
}

var text = document.querySelector(".menu_img");
var menu = document.querySelector(".menu");
menu.style.display = "none";
text.onclick = function () {
  sel(menu, i1);
  if (i1 === "접기") {
    i1 = "펼치기";
    console.log("suc");
  } else {
    i1 = "접기";
  }
};
