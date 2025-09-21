// payment_1.js

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.book-item').forEach(function (el) {
    el.addEventListener('click', function () {
      el.classList.toggle('selected');
    });
  });
}); 