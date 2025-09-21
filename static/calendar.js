// calendar.js
const calendarContainer = document.getElementById('calendar-container');

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function renderCalendar(year, month) {
  calendarContainer.innerHTML = '';
  // Header
  const header = document.createElement('div');
  header.className = 'calendar-header';
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '<';
  prevBtn.className = 'calendar-nav';
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '>';
  nextBtn.className = 'calendar-nav';
  const title = document.createElement('span');
  title.className = 'calendar-title';
  title.textContent = `${year}년 ${month + 1}월`;
  header.appendChild(prevBtn);
  header.appendChild(title);
  header.appendChild(nextBtn);
  calendarContainer.appendChild(header);
  // Table
  const table = document.createElement('table');
  table.className = 'calendar-table';
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  days.forEach((d, i) => {
    const th = document.createElement('th');
    th.textContent = d;
    th.className = i === 0 ? 'sun' : i === 6 ? 'sat' : '';
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  const firstDay = getFirstDayOfWeek(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  // 날짜 배열 생성
  let calendarMatrix = Array.from({ length: 6 }, () => Array(7).fill(''));
  let date = 1;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) continue;
      if (date > daysInMonth) break;
      calendarMatrix[i][j] = date;
      date++;
    }
  }

  // 마지막 주에 남는 날짜가 1~2개면, 첫 주의 빈 칸에 올려줌
  const lastRow = calendarMatrix[5];
  const lastRowDates = lastRow.filter(x => x !== '');
  if (lastRowDates.length > 0 && lastRowDates.length <= 2) {
    // 첫 주의 빈 칸 인덱스 찾기
    let firstRow = calendarMatrix[0];
    let emptyIdxs = [];
    for (let j = 0; j < 7; j++) {
      if (firstRow[j] === '') emptyIdxs.push(j);
    }
    // 올릴 수 있는 만큼만 올림
    for (let k = 0; k < lastRowDates.length && k < emptyIdxs.length; k++) {
      firstRow[emptyIdxs[k]] = lastRowDates[k];
      lastRow[lastRow.indexOf(lastRowDates[k])] = '';
    }
  }

  // 달력 그리기
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      if (calendarMatrix[i][j] !== '') {
        const d = calendarMatrix[i][j];
        cell.textContent = d;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        cell.dataset.date = dateStr;
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', function() {
          cell.classList.add('clicked');
          setTimeout(() => cell.classList.remove('clicked'), 180);
          showDiaryPopup(this.dataset.date);
        });
        // 오늘, 일/토요일 스타일 등 추가
        const today = new Date();
        if (
          d === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          cell.classList.add('today');
        }
        if (j === 0) cell.classList.add('sun');
        if (j === 6) cell.classList.add('sat');
      }
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  calendarContainer.appendChild(table);
  // Navigation
  prevBtn.onclick = () => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    renderCalendar(prevYear, prevMonth);
  };
  nextBtn.onclick = () => {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    renderCalendar(nextYear, nextMonth);
  };
}
const now = new Date();
renderCalendar(now.getFullYear(), now.getMonth());

// calendar 스타일은 main.css에 추가 필요 