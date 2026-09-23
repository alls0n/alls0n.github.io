document.querySelectorAll(".carousel").forEach(function (root) {
  var track = root.querySelector(".carousel__track");
  if (!track) return;

  var status = root.querySelector(".carousel__status");
  var slides = track.children.length;
  var step   = function () { return track.children[0].getBoundingClientRect().width; };
  var index  = function () { return Math.round(track.scrollLeft / step()); };
  var atEnd  = function () { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 2; };

  function update() {
    if (status) status.textContent = (atEnd() ? slides : index() + 1) + " / " + slides;
  }

  function go(dir) {
    if (dir > 0 && atEnd())                    track.scrollTo({ left: 0 });                 // wrap to start
    else if (dir < 0 && track.scrollLeft <= 2) track.scrollTo({ left: track.scrollWidth }); // wrap to end
    else                                       track.scrollBy({ left: dir * step() });
  }

  root.querySelectorAll(".carousel__buttons button").forEach(function (btn) {
    btn.addEventListener("click", function () { go(Number(btn.dataset.dir)); });
  });

  track.addEventListener("scroll", update);
  var wheelSpeed = 3;   // try values between 1.5 and 4 — see notes below

  track.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {   // only hijack when it's primarily a vertical scroll
      e.preventDefault();
      track.scrollLeft += e.deltaY * wheelSpeed;
    }
  }, { passive: false });

  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); go(-1); }
  });

  update();
});
/*
// Carousel buttons, counter, and arrow-key support (works for every carousel on the page)
document.querySelectorAll(".carousel").forEach(function (root) {
var track = root.querySelector(".carousel__track");
if (!track) return;

var status  = root.querySelector(".carousel__status");
var slides  = track.children.length;
var current = function () { return Math.round(track.scrollLeft / track.clientWidth); };

status.textContent = "1 / " + slides;   // keeps the counter right if you add or remove slides

function go(i) {
    i = (i + slides) % slides;
    track.scrollTo({ left: i * track.clientWidth });
}

root.querySelectorAll(".carousel__buttons button").forEach(function (btn) {
    btn.addEventListener("click", function () {
    go(current() + Number(btn.dataset.dir));
    });
});

track.addEventListener("scroll", function () {
    status.textContent = (current() + 1) + " / " + slides;
});

track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(current() + 1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); go(current() - 1); }
});
});*/