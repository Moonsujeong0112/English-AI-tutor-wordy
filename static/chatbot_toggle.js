const diaryBtn = document.getElementById('diaryBtn');
const essayBtn = document.getElementById('essayBtn');

diaryBtn.addEventListener('click', () => {
  diaryBtn.classList.add('active');
  essayBtn.classList.remove('active');
});

essayBtn.addEventListener('click', () => {
  essayBtn.classList.add('active');
  diaryBtn.classList.remove('active');
}); 