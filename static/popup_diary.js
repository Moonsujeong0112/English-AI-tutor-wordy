function showDiaryPopup(dateStr) {
  // dateStr: '2025-07-15'
  const [y, m, d] = dateStr.split('-');
  const displayDate = `${y}년 ${m}월 ${d}일`;
  let diaryTitle = "The day I fight with my friends";
  let editedLines = [
    "I threw a ball. I threw the ball to my friend.",
    "The ball hit him and he cried.",
    "I apologized to my friend because he was hurt.",
    "He said 'It's ok.' I felt good and happy too."
  ];
  let originalLines = [
    "<span style='color:#ff9800;'>I throw a ball. friend.</span>",
    "<span style='color:#ff9800;'>He cried hit the ball.</span>",
    "<span style='color:#ff9800;'>I'm sorry to friend.</span>"
  ];
  let vocabEn = ["hurt", "say / said", "apologize", "make up", "together"];
  let vocabKo = ["다친, 아픈", "말하다 / 말했다", "사과하다", "화해하다", "함께"];

  // 7월 24일만 다른 내용으로
  let popupImageSrc = '/static/img/popup_image1.png';
  if (dateStr === "2025-07-24") {
    diaryTitle = "My Special Picnic";
    editedLines = [
      "I went to the zoo with my family, today.",
      "I saw a big panda.",
      "And I saw a big elephant.",
      "I was so happy to take photos with the cute animals at the zoo.",
      "I went to the zoo on Saturday.",
      "My favorite animal is peacock, and I saw a peacock dancing in the park.",
      "We had dinner together, and my mom's lunchbox was so yummy.",
      "My mom gave me a delicious cotton candy.",
      "We ate lunch and then she bought me cotton candy.",
      "It was a happy day."
    ];
    originalLines = [
      "", // 1
      "", // 2
      "<span style='color:#ff9800;'>And 코끼리</span>", // 3
      "", // 4
      "", // 5
      "", // 6
      "", // 7
      "", // 8
      "", // 9
      "<span style='color:#ff9800;'>It was happy day.</span>" // 10
    ];
    vocabEn = ["family", "elephant", "peacock", "cotton candy", "delicious"];
    vocabKo = ["가족", "코끼리", "공작새", "솜사탕", "맛있는"];
    popupImageSrc = '/static/img/peacock.jpg';
  }

  // vocabHtml을 popupHtml보다 먼저 선언
  const vocabHtml = `
    <div class="popup-vocab">
      <div class="popup-vocab-list">
        ${vocabEn.map(v => `<span>${v}</span>`).join('')}
      </div>
      <div class="popup-vocab-list ko">
        ${vocabKo.map(v => `<span>${v}</span>`).join('')}
      </div>
    </div>
  `;

  // renderDiaryContent 함수를 popupHtml 선언보다 위에 위치
  function renderDiaryContent(showOriginal) {
    let html = '';
    for (let i = 0; i < editedLines.length; i++) {
      // HTML 태그 제거 후 비교
      const editedText = editedLines[i].replace(/<[^>]+>/g, '');
      html += `<div class="diary-line">
        <span class="edited">${editedLines[i]}</span>
        ${
          showOriginal &&
          originalLines[i] &&
          editedText !== originalLines[i]
            ? `<span class="original-hint">${originalLines[i]}</span>`
            : ''
        }
      </div>`;
    }
    return html;
  }

  const popupHtml = `
    <div class="popup">
      <div class="popup-header">
        <div class="popup-tabs">
          <button class="popup-tab popup-tab-diary">
            <img src="/static/img/popup_button1-2.png" alt="다이어리 배경">
            <span class="tab-label">일기</span>
          </button>
          <button class="popup-tab popup-tab-essay">
            <img src="/static/img/popup_button2-2.png" alt="에세이 비활성화">
            <span class="tab-label">에세이</span>
          </button>
        </div>
        <div class="popup-close" onclick="closeDiaryPopup()">
          <img src="/static/img/popup_icon1.png" alt="닫기">
        </div>
      </div>
      <div class="popup-content">
        <div class="popup-image">
          <img src="${popupImageSrc}" alt="일기 이미지">
        </div>
        <div class="popup-date-vocab">
          <div class="popup-date">${displayDate} 
            <img class="popup-date-icon" src="/static/img/popup_icon4.png" alt="날씨">
          </div>
          ${vocabHtml}
        </div>
      </div>
      <div class="popup-diary-wrapper">
            <div class="date-nav-button-wrapper">
                <button class="date-nav-button prev">
                    <img src="/static/img/popup_icon5.png" alt="이전 날짜" />
                </button>
            </div>

            <div class="popup-diary">
                <div class="popup-diary-toggle-wrapper">
                  <div class="popup-diary-toggle">
                    <button class="image-toggle-button" id="toggleButton" aria-pressed="false">
                      <span class="toggle-text">OFF</span>
                    </button>
                    <div class="toggle-label">첫 글 보기</div>
                  </div>
                </div>
              
                <div class="popup-diary-title">${diaryTitle}</div>
                <div class="popup-diary-divider"></div>
                <div class="popup-diary-content">
                  ${renderDiaryContent(false)}
                </div>
              </div>

            <div class="date-nav-button-wrapper">
                <button class="date-nav-button next">
                    <img src="/static/img/popup_icon6.png" alt="다음 날짜" />
                </button>
            </div>
        </div>
      <div class="popup-actions">
        <button class="icon icon-edit">
          <img src="/static/img/popup_icon2.png" alt="수정">
        </button>
        <button class="icon icon-share">
          <img src="/static/img/popup_icon3.png" alt="공유">
        </button>
      </div>
    </div>
  `;
  if (dateStr === "2025-07-21") {
    let container = document.getElementById('popup-diary-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'popup-diary-container';
      document.body.appendChild(container);
    }
    // Format date as '2025년 07월 21일'
    const [y, m, d] = dateStr.split('-');
    const displayDate = `${y}년 ${m}월 ${d}일`;
    container.innerHTML = `
    <div class=\"popup\">
        <div class=\"popup-header\">
            <div class=\"popup-tabs\">
                <button class=\"popup-tab popup-tab-diary\">
                    <img src=\"/static/img/popup_button1-2.png\" alt=\"일기 배경\" />
                    <span class=\"tab-label\">일기</span>
                </button>
                <button class=\"popup-tab popup-tab-essay\">
                    <img src=\"/static/img/popup_button2-2.png\" alt=\"에세이 배경\" />
                    <span class=\"tab-label\">에세이</span>
                </button>
            </div>
            <div class=\"popup-close\" onclick=\"closeDiaryPopup()\">
                <img src=\"/static/img/popup_icon1.png\" alt=\"닫기\">
            </div>
        </div>
        <div class=\"popup-content\">
            <div class=\"popup-image\">
                <img src=\"/static/img/diary3_img.png\" alt=\"일기 이미지\">
            </div>
            <div class=\"popup-date-vocab\">
                <div class=\"popup-date\">${displayDate}
                    <img class=\"popup-date-icon\" src=\"/static/img/popup_icon4.png\" alt=\"날씨\">
                </div>
                <div class=\"popup-vocab\">
                    <div class=\"popup-vocab-list\">
                        <span>friend</span>
                        <span>hot</span>
                        <span>spicy</span>
                        <span>again</span>
                        <span>eat</span>
                    </div>
                    <div class=\"popup-vocab-list ko\">
                        <span>친구</span>
                        <span>뜨거운</span>
                        <span>매운</span>
                        <span>다시</span>
                        <span>먹다</span>
                    </div>
                </div>
            </div>
        </div>
        <div class=\"popup-diary-wrapper\">
            <div class=\"date-nav-button-wrapper\">
                <button class=\"date-nav-button prev\">
                    <img src=\"/static/img/popup_icon5.png\" alt=\"이전 날짜\" />
                </button>
            </div>
            <div class=\"popup-diary\">
                <div class=\"popup-diary-toggle-wrapper\">
                  <div class=\"popup-diary-toggle\">
                    <button class=\"image-toggle-button\" id=\"toggleButton\" aria-pressed=\"false\">
                      <span class=\"toggle-text\">OFF</span>
                    </button>
                    <div class=\"toggle-label\">첫 글 보기</div>
                  </div>
                </div>
                <div class=\"popup-diary-title\">A Special day after school</div>
                <div class=\"popup-diary-divider\"></div>
                <div class=\"popup-diary-content\">
                Today after school, I ate tteokbokki with my friend.<br />
                We went to a small tteokbokki shop near school.<br />
                The tteokbokki was hot and a little spicy.<br />
                While eating, we talked and laughed a lot.<br />
                It was very fun. I felt so happy.<br />
                The food was really yummy. I want to go there again soon.<br />
                Next time, I want to eat tteokbokki with my friend again!
                </div>
              </div>
            <div class=\"date-nav-button-wrapper\">
                <button class=\"date-nav-button next\">
                    <img src=\"/static/img/popup_icon6.png\" alt=\"다음 날짜\" />
                </button>
            </div>
        </div>
        <div class=\"popup-actions\">
            <button class=\"icon icon-edit\">
                <img src=\"/static/img/popup_icon2.png\" alt=\"수정\">
            </button>
            <button class=\"icon icon-share\">
                <img src=\"/static/img/popup_icon3.png\" alt=\"공유\">
            </button>
        </div>
    </div>
    <script>
        const toggleBtn = document.getElementById('toggleButton');
        const toggleText = toggleBtn.querySelector('.toggle-text');
        toggleBtn.addEventListener('click', () => {
            const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
            toggleBtn.setAttribute('aria-pressed', !isPressed);
            toggleText.textContent = isPressed ? 'OFF' : 'ON';
        });
    <\/script>
    `;
    container.style.display = 'flex';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0px';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.background = 'rgba(0,0,0,0.15)';
    container.style.zIndex = '9999';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'flex-start';
    // prev/next 버튼 이벤트 연결
    const prevBtn = container.querySelector('.date-nav-button.prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        showDiaryPopup('2025-07-20');
      });
    }
    const nextBtn = container.querySelector('.date-nav-button.next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        showDiaryPopup('2025-07-22');
      });
    }
    // 탭 전환 이벤트 연결
    const essayTab = container.querySelector('.popup-tab-essay');
    if (essayTab) {
      essayTab.addEventListener('click', function() {
        showEssayPopup(dateStr);
      });
    }
    const diaryTab = container.querySelector('.popup-tab-diary');
    if (diaryTab) {
      diaryTab.addEventListener('click', function() {
        showDiaryPopup(dateStr);
      });
    }
    return;
  }
  if (dateStr === "2025-07-22") {
    let container = document.getElementById('popup-diary-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'popup-diary-container';
      document.body.appendChild(container);
    }
    // Format date as '2025년 07월 22일'
    const [y, m, d] = dateStr.split('-');
    const displayDate = `${y}년 ${m}월 ${d}일`;
    container.innerHTML = `
    <div class=\"popup\">
        <div class=\"popup-header\">
            <div class=\"popup-tabs\">
                <button class=\"popup-tab popup-tab-diary\">
                    <img src=\"/static/img/popup_button1-2.png\" alt=\"일기 배경\" />
                    <span class=\"tab-label\">일기</span>
                </button>
                <button class=\"popup-tab popup-tab-essay\">
                    <img src=\"/static/img/popup_button2-2.png\" alt=\"에세이 배경\" />
                    <span class=\"tab-label\">에세이</span>
                </button>
            </div>
            <div class=\"popup-close\" onclick=\"closeDiaryPopup()\">
                <img src=\"/static/img/popup_icon1.png\" alt=\"닫기\">
            </div>
        </div>
        <div class=\"popup-content\">
            <div class=\"popup-image\">
                <img src=\"/static/img/diary2_img.png\" alt=\"일기 이미지\">
            </div>
            <div class=\"popup-date-vocab\">
                <div class=\"popup-date\">${displayDate}
                    <img class=\"popup-date-icon\" src=\"/static/img/popup_icon4.png\" alt=\"날씨\">
                </div>
                <div class=\"popup-vocab\">
                    <div class=\"popup-vocab-list\">
                        <span>scratched</span>
                        <span>butt</span>
                        <span>scared</span>
                        <span>held</span>
                        <span>keychain</span>
                    </div>
                    <div class=\"popup-vocab-list ko\">
                        <span>긁었다</span>
                        <span>엉덩이</span>
                        <span>무서워하는</span>
                        <span>잡았다</span>
                        <span>열쇠고리</span>
                    </div>
                </div>
            </div>
        </div>
        <div class=\"popup-diary-wrapper\">
            <div class=\"date-nav-button-wrapper\">
                <button class=\"date-nav-button prev\">
                    <img src=\"/static/img/popup_icon5.png\" alt=\"이전 날짜\" />
                </button>
            </div>
            <div class=\"popup-diary\">
                <div class=\"popup-diary-toggle-wrapper\">
                  <div class=\"popup-diary-toggle\">
                    <button class=\"image-toggle-button\" id=\"toggleButton\" aria-pressed=\"false\">
                      <span class=\"toggle-text\">OFF</span>
                    </button>
                    <div class=\"toggle-label\">첫 글 보기</div>
                  </div>
                </div>
                <div class=\"popup-diary-title\">Zoo Trip with My Family</div>
                <div class=\"popup-diary-divider\"></div>
                <div class=\"popup-diary-content\">
                  Today I went to the zoo with my family.<br /> 
                  I saw a big elephant and a tall giraffe.<br />
                  The monkeys were so funny and loud.<br /> 
                  One monkey even scratched its butt!<br />
                  I laughed a lot and took many pictures.<br /> 
                  I ate ice cream and a hotdog for lunch.<br />
                  My little brother got scared of the lion.<br />
                  I held his hand and told him it's okay.<br />
                  Before we went home, I bought a tiger keychain.<br /> 
                  It was the best zoo trip ever!<br />
                </div>
              </div>
            <div class=\"date-nav-button-wrapper\">
                <button class=\"date-nav-button next\">
                    <img src=\"/static/img/popup_icon6.png\" alt=\"다음 날짜\" />
                </button>
            </div>
        </div>
        <div class=\"popup-actions\">
            <button class=\"icon icon-edit\">
                <img src=\"/static/img/popup_icon2.png\" alt=\"수정\">
            </button>
            <button class=\"icon icon-share\">
                <img src=\"/static/img/popup_icon3.png\" alt=\"공유\">
            </button>
        </div>
    </div>
    <script>
        const toggleBtn = document.getElementById('toggleButton');
        const toggleText = toggleBtn.querySelector('.toggle-text');
        toggleBtn.addEventListener('click', () => {
            const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
            toggleBtn.setAttribute('aria-pressed', !isPressed);
            toggleText.textContent = isPressed ? 'OFF' : 'ON';
        });
    <\/script>
    `;
    container.style.display = 'flex';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0px';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.background = 'rgba(0,0,0,0.15)';
    container.style.zIndex = '9999';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'flex-start';
    // prev/next 버튼 이벤트 연결
    const prevBtn = container.querySelector('.date-nav-button.prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        showDiaryPopup('2025-07-21');
      });
    }
    const nextBtn = container.querySelector('.date-nav-button.next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        showDiaryPopup('2025-07-23');
      });
    }
    // 탭 전환 이벤트 연결
    const essayTab = container.querySelector('.popup-tab-essay');
    if (essayTab) {
      essayTab.addEventListener('click', function() {
        showEssayPopup(dateStr);
      });
    }
    const diaryTab = container.querySelector('.popup-tab-diary');
    if (diaryTab) {
      diaryTab.addEventListener('click', function() {
        showDiaryPopup(dateStr);
      });
    }
    return;
  }
  if (dateStr >= "2025-07-25") {
    let container = document.getElementById('popup-diary-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'popup-diary-container';
      document.body.appendChild(container);
    }
    // Format date as '2025년 MM월 DD일'
    const [y, m, d] = dateStr.split('-');
    const displayDate = `${y}년 ${m}월 ${d}일`;
    container.innerHTML = `
    <div class=\"popup\">
        <div class=\"popup-header\">
            <div class=\"popup-tabs\">
                <button class=\"popup-tab popup-tab-diary\">
                    <img src=\"/static/img/popup_button1-2.png\" alt=\"일기 배경\" />
                    <span class=\"tab-label\">일기</span>
                </button>
                <button class=\"popup-tab popup-tab-essay\">
                    <img src=\"/static/img/popup_button2-2.png\" alt=\"에세이 배경\" />
                    <span class=\"tab-label\">에세이</span>
                </button>
            </div>
            <div class=\"popup-close\" onclick=\"closeDiaryPopup()\">
                <img src=\"/static/img/popup_icon1.png\" alt=\"닫기\">
            </div>
        </div>
        <div class=\"popup-content\">
            <div class=\"popup-image\" style=\"display:flex;justify-content:center;align-items:center;min-height:180px;height:220px;\">
                <span style=\"font-size:64px;display:inline-block;\">❗</span>
            </div>
            <div class=\"popup-date-vocab\">
                <div class=\"popup-date\">${displayDate}
                    <img class=\"popup-date-icon\" src=\"/static/img/popup_icon4.png\" alt=\"날씨\">
                </div>
                <div class=\"popup-vocab\" style=\"min-height:80px;\"></div>
            </div>
        </div>
        <div class=\"popup-diary-wrapper\" style=\"margin-top:5px;\">
            <div class=\"date-nav-button-wrapper\">
                <button class=\"date-nav-button prev\">
                    <img src=\"/static/img/popup_icon5.png\" alt=\"이전 날짜\" />
                </button>
            </div>
            <div class=\"popup-diary\" style=\"width:100%;display:flex;justify-content:center;align-items:center;min-height:220px;\">
                <div style=\"width:100%;text-align:center;font-size:22px;color:#888;\">아직 쓴 일기가 없어요!</div>
            </div>
            <div class=\"date-nav-button-wrapper\">
                <button class=\"date-nav-button next\">
                    <img src=\"/static/img/popup_icon6.png\" alt=\"다음 날짜\" />
                </button>
            </div>
        </div>
        <div class=\"popup-actions\">
            <button class=\"icon icon-edit\">
                <img src=\"/static/img/popup_icon2.png\" alt=\"수정\">
            </button>
            <button class=\"icon icon-share\">
                <img src=\"/static/img/popup_icon3.png\" alt=\"공유\">
            </button>
        </div>
    </div>
    <script>
        const toggleBtn = document.getElementById('toggleButton');
        if(toggleBtn){
          const toggleText = toggleBtn.querySelector('.toggle-text');
          toggleBtn.addEventListener('click', () => {
              const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
              toggleBtn.setAttribute('aria-pressed', !isPressed);
              toggleText.textContent = isPressed ? 'OFF' : 'ON';
          });
        }
    <\/script>
    `;
    container.style.display = 'flex';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0px';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.background = 'rgba(0,0,0,0.15)';
    container.style.zIndex = '9999';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'flex-start';
    // prev/next 버튼 이벤트 연결
    const prevBtn = container.querySelector('.date-nav-button.prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        // 이전 날짜로 이동
        const prev = new Date(dateStr);
        prev.setDate(prev.getDate() - 1);
        const prevStr = prev.toISOString().slice(0, 10);
        showDiaryPopup(prevStr);
      });
    }
    const nextBtn = container.querySelector('.date-nav-button.next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        // 다음 날짜로 이동
        const next = new Date(dateStr);
        next.setDate(next.getDate() + 1);
        const nextStr = next.toISOString().slice(0, 10);
        showDiaryPopup(nextStr);
      });
    }
    // 탭 전환 이벤트 연결
    const essayTab = container.querySelector('.popup-tab-essay');
    if (essayTab) {
      essayTab.addEventListener('click', function() {
        showEssayPopup(dateStr);
      });
    }
    const diaryTab = container.querySelector('.popup-tab-diary');
    if (diaryTab) {
      diaryTab.addEventListener('click', function() {
        showDiaryPopup(dateStr);
      });
    }
    return;
  }

  let container = document.getElementById('popup-diary-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'popup-diary-container';
    document.body.appendChild(container);
  }
  container.innerHTML = popupHtml;
  container.style.display = 'flex';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0px';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.background = 'rgba(0,0,0,0.15)';
  container.style.zIndex = '9999';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'flex-start'; // 일기 팝업 위치와 동일하게

  // 토글 동작 추가 (클래스 기반, 여러 개도 지원)
  const toggleBtns = container.querySelectorAll('.image-toggle-button');
  toggleBtns.forEach(toggleBtn => {
    const toggleText = toggleBtn.querySelector('.toggle-text');
    const diaryContentDiv = container.querySelector('.popup-diary-content');
    // 라인별 수정본/원본 예시
    // 최초는 OFF(수정본만)
    if (diaryContentDiv) diaryContentDiv.innerHTML = renderDiaryContent(false);
    toggleBtn.addEventListener('click', () => {
      const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
      toggleBtn.setAttribute('aria-pressed', !isPressed);
      toggleText.textContent = isPressed ? 'OFF' : 'ON';
      if (diaryContentDiv) {
        diaryContentDiv.innerHTML = renderDiaryContent(!isPressed);
      }
    });
  });

  // 탭 전환 이벤트 연결
  const essayTab = container.querySelector('.popup-tab-essay');
  if (essayTab) {
    essayTab.addEventListener('click', function() {
      showEssayPopup(dateStr);
    });
  }
  const diaryTab = container.querySelector('.popup-tab-diary');
  if (diaryTab) {
    diaryTab.addEventListener('click', function() {
      showDiaryPopup(dateStr);
    });
  }

  // 날짜 계산 함수
  function getPrevDate(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }
  function getNextDate(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  // 팝업 생성 후 이벤트 연결
  const prevBtn = container.querySelector('.date-nav-button.prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      showDiaryPopup(getPrevDate(dateStr));
    });
  }
  const nextBtn = container.querySelector('.date-nav-button.next');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      showDiaryPopup(getNextDate(dateStr));
    });
  }
}

function showEssayPopup(dateStr) {
  // Ensure popup_essay.css is loaded
  if (!document.getElementById('popup-essay-css')) {
    const link = document.createElement('link');
    link.id = 'popup-essay-css';
    link.rel = 'stylesheet';
    link.href = '/static/popup_essay.css';
    document.head.appendChild(link);
  }
  const [y, m, d] = dateStr.split('-');
  const displayDate = `${y}년 ${m}월 ${d}일`;
  const popupHtml = `
    <div class="popup">
      <div class="popup-header">
        <div class="popup-tabs">
          <button class="popup-tab popup-tab-diary">
            <img src="/static/img/popup_button2-2.png" alt="일기 배경" />
            <span class="tab-label">일기</span>
          </button>
          <button class="popup-tab popup-tab-essay">
            <img src="/static/img/popup_button1-2.png" alt="에세이 배경" />
            <span class="tab-label">에세이</span>
          </button>
        </div>
        <div class="popup-close" onclick="closeDiaryPopup()">
          <img src="/static/img/popup_icon1.png" alt="닫기" />
        </div>
      </div>
      <div class="popup-content">
        <div class="popup-expression-box">
          <div class="expression-header">오늘의 표현</div>
          <div class="expression-slider">
            <button class="slider-btn prev" aria-label="이전">
              <img src="/static/img/popup_essay_button1.png" alt="이전" />
            </button>
            <div class="expression-grid">
              <div class="expression-card"><div class="expression-en">wear school uniforms</div><div class="expression-ko">교복을 입다</div></div>
              <div class="expression-card"><div class="expression-en">look smart</div><div class="expression-ko">똑똑해 보이다</div></div>
              <div class="expression-card"><div class="expression-en">save time</div><div class="expression-ko">시간을 절약하다</div></div>
              <div class="expression-card"><div class="expression-en">don’t have to</div><div class="expression-ko">~할 필요 없다</div></div>
            </div>
            <button class="slider-btn next" aria-label="다음">
              <img src="/static/img/popup_essay_button2.png" alt="다음" />
            </button>
          </div>
        </div>
        <div class="popup-date-vocab">
          <div class="popup-date">${displayDate}
            <img class="popup-date-icon" src="/static/img/popup_icon4.png" alt="날씨" />
          </div>
          <div class="popup-vocab">
            <div class="popup-vocab-list">
              <span>uniform</span>
              <span>smart</span>
              <span>boring</span>
              <span>save</span>
              <span>helpful</span>
            </div>
            <div class="popup-vocab-list ko">
              <span>교복</span>
              <span>똑똑하다</span>
              <span>지루한</span>
              <span>아끼다</span>
              <span>도움이 되는</span>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-diary-wrapper">
        <div class="date-nav-button-wrapper">
          <button class="date-nav-button prev">
            <img src="/static/img/popup_icon5.png" alt="이전 날짜" />
          </button>
        </div>
        <div class="popup-diary">
          <div class="popup-diary-toggle-wrapper">
            <div class="popup-diary-toggle">
              <button class="image-toggle-button" id="toggleButtonEssay" aria-pressed="false">
                <span class="toggle-text">OFF</span>
              </button>
              <div class="toggle-label">첫 글 보기</div>
            </div>
          </div>
          <div class="popup-diary-title">Should students wear school uniforms?</div>
          <div class="popup-diary-divider"></div>
          <div class="popup-diary-content">
            I think school uniform is good. Uniform helps us look same and smart. It is good because no more think about clothes. Some students don’t like it.<br />
            They say it’s boring. But I think uniform make school better. Also, uniforms help us save time.  When I wake up, I wear uniform fast and go school. It’s helpful for parents too.  They don’t buy many clothes for school.<br />
            Some people want to show their style.  But school is for learn, not for fashion.
            So I think uniform is good idea for all students.
          </div>
        </div>
        <div class="date-nav-button-wrapper">
          <button class="date-nav-button next">
            <img src="/static/img/popup_icon6.png" alt="다음 날짜" />
          </button>
        </div>
      </div>
      <div class="popup-actions">
        <button class="icon icon-edit">
          <img src="/static/img/popup_icon2.png" alt="수정" />
        </button>
        <button class="icon icon-share">
          <img src="/static/img/popup_icon3.png" alt="공유" />
        </button>
      </div>
    </div>
  `;
  let container = document.getElementById('popup-diary-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'popup-diary-container';
    document.body.appendChild(container);
  }
  container.innerHTML = popupHtml;
  container.style.display = 'flex';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0px';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.background = 'rgba(0,0,0,0.15)';
  container.style.zIndex = '9999';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'flex-start'; // 일기 팝업 위치와 동일하게

  // 토글 동작 추가 (에세이용)
  const toggleBtn = document.getElementById('toggleButtonEssay');
  if (toggleBtn) {
    const toggleText = toggleBtn.querySelector('.toggle-text');
    toggleBtn.addEventListener('click', () => {
      const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
      toggleBtn.setAttribute('aria-pressed', !isPressed);
      toggleText.textContent = isPressed ? 'OFF' : 'ON';
    });
  }

  // 탭 전환 이벤트 연결
  const diaryTab = container.querySelector('.popup-tab-diary');
  if (diaryTab) {
    diaryTab.addEventListener('click', function() {
      showDiaryPopup(dateStr);
    });
  }
  const essayTab = container.querySelector('.popup-tab-essay');
  if (essayTab) {
    essayTab.addEventListener('click', function() {
      showEssayPopup(dateStr);
    });
  }
}

function closeDiaryPopup() {
  const container = document.getElementById('popup-diary-container');
  if (container) {
    container.style.display = 'none';
    container.innerHTML = '';
  }
} 