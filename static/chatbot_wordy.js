// AI English Writing Chatbot JavaScript
class WordyChatbot {
    constructor() {
        this.diaryId = null; // diary_id 저장용 변수 추가
        this.diarySentences = [];
        this.sentenceCount = 0;
        this.isProcessing = false;
        this.init();
        this.renderSentenceCount(); // 최초 표시
    }

    renderSentenceCount() {
        let counter = document.getElementById('sentenceCountDisplay');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'sentenceCountDisplay';
            counter.style.textAlign = 'center';
            counter.style.fontSize = '20px';
            counter.style.fontWeight = 'bold';
            counter.style.margin = '12px 0 0 0';
            counter.style.color = '#ff9800';
            // 채팅창 위에 삽입
            const chat = document.querySelector('.wordy-chat');
            if (chat && chat.parentNode) {
                chat.parentNode.insertBefore(counter, chat);
            }
        }
        counter.textContent = `현재까지 작성한 일기: ${this.sentenceCount}문장`;
    }

    async init() {
        try {
            const response = await fetch('/api/ai-chat/init/');
            const data = await response.json();
            if (data.success) {
                this.addBotMessage(data.conversation, data.feedback);
                this.diarySentences = data.diary_sentences || [];
                this.sentenceCount = data.sentence_count || 0;
                this.diaryId = data.diary_id || null; // 초기화 시 diary_id도 저장
                this.renderSentenceCount();
            }
        } catch (error) {
            console.error('Failed to initialize chatbot:', error);
            this.addBotMessage('Hello~ What do you want to talk about in your English diary today?');
        }
        this.setupEventListeners();
    }

    setupEventListeners() {
        const input = document.querySelector('.wordy-input');
        const sendButton = document.querySelector('.wordy-input-send');
        const form = document.querySelector('.wordy-input-row');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        if (sendButton) {
            sendButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
        const diaryBtn = document.getElementById('diaryBtn');
        const essayBtn = document.getElementById('essayBtn');
        if (diaryBtn && essayBtn) {
            diaryBtn.addEventListener('click', () => this.switchMode('diary'));
            essayBtn.addEventListener('click', () => this.switchMode('essay'));
        }
        const chatContainer = document.querySelector('.wordy-chat');
        if (chatContainer) {
            chatContainer.addEventListener('scroll', () => {
                this.handleScroll();
            });
        }
    }

    async sendMessage() {
        const input = document.querySelector('.wordy-input');
        const message = input.value.trim();
        if (!message || this.isProcessing) return;
        this.isProcessing = true;
        input.value = '';
        this.addUserMessage(message);
        try {
            const response = await fetch('/api/ai-chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({
                    message: message,
                    diary_sentences: this.diarySentences,
                    diary_id: this.diaryId // 항상 diary_id 포함
                })
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                this.addBotMessage('Sorry, I encountered an error. Please try again.');
                return;
            }

            if (!response.ok) {
                // 403 등 에러 응답일 때 moderation 차단 메시지 우선 노출
                if (data.blocked && data.message) {
                    this.addBotMessage(data.message);
                } else {
                    this.addBotMessage('Sorry, I encountered an error. Please try again.');
                }
                return;
            }

            if (data.diary_id) {
                this.diaryId = data.diary_id; // 응답에서 diary_id 저장
            }
            if (data.success) {
                if (data.sentence_count === 10) {
                    this.showDiarySummary(data.conversation);
                } else {
                    this.addBotMessage(data.conversation, data.feedback);
                }
                if (!data.is_retry) {
                    this.diarySentences = data.diary_sentences;
                    this.sentenceCount = data.sentence_count;
                    this.renderSentenceCount();
                }
                if (data.is_savable) {
                    this.showSaveNotification();
                }
            } else {
                this.addBotMessage('Sorry, I encountered an error. Please try again.');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            this.addBotMessage('Sorry, I encountered an error. Please try again.');
        } finally {
            this.isProcessing = false;
        }
    }

    showDiarySummary(diaryText) {
        const chatContainer = document.querySelector('.wordy-chat');
        const messageRow = document.createElement('div');
        messageRow.className = 'wordy-chat-row wordy-chat-row-bot';
        messageRow.innerHTML = `
            <div class="wordy-bubble wordy-bubble-bot" style="background:#fffff; border:2px solid #ff9800; margin: 24px 0;">
                <div class="wordy-bubble-main" style="font-size:24px; color:#ff9800; font-weight:bold; margin-bottom:8px;">
                    🎉 오늘의 일기 완성! 🎉
                </div>
                <div class="wordy-bubble-main" style="white-space:pre-line; font-size:20px; color:#222;">
                    ${this.escapeHtml(diaryText)}
                </div>
            </div>
        `;
        chatContainer.appendChild(messageRow);
        this.scrollToBottom();
    }

    addUserMessage(message) {
        const chatContainer = document.querySelector('.wordy-chat');
        const messageRow = document.createElement('div');
        messageRow.className = 'wordy-chat-row wordy-chat-row-user';
        messageRow.innerHTML = `
            <div class="wordy-bubble wordy-bubble-user">
                ${this.escapeHtml(message)}
            </div>
        `;
        chatContainer.appendChild(messageRow);
        this.scrollToBottom();
    }

    addBotMessage(conversation, feedback) {
        const chatContainer = document.querySelector('.wordy-chat');
        const messageRow = document.createElement('div');
        messageRow.className = 'wordy-chat-row wordy-chat-row-bot';
        let bubbleHtml = `
            <div class="wordy-avatar">
                <img src="/static/img/chatbot_logo2.png" alt="Wordy 아바타" width="100" height="100" style="object-fit:contain;" />
            </div>
            <div class="wordy-bubble wordy-bubble-bot">
                <div class="wordy-bubble-main">${this.escapeHtml(conversation)}</div>
                ${feedback ? `<div class="wordy-bubble-main" style="color:#888;font-size:20px;">${this.escapeHtml(feedback)}</div>` : ''}
            </div>
        `;
        messageRow.innerHTML = bubbleHtml;
        chatContainer.appendChild(messageRow);
        this.scrollToBottom();
    }

    showSaveNotification() {
        console.log('Sentence saved successfully!');
    }

    showCompletionMessage() {
        setTimeout(() => {
            this.addBotMessage('Great job! You\'ve completed your English diary with 10 sentences. Well done!');
        }, 1000);
    }

    switchMode(mode) {
        const diaryBtn = document.getElementById('diaryBtn');
        const essayBtn = document.getElementById('essayBtn');
        if (mode === 'diary') {
            diaryBtn.classList.add('active');
            essayBtn.classList.remove('active');
        } else {
            essayBtn.classList.add('active');
            diaryBtn.classList.remove('active');
        }
        this.resetChat();
    }

    resetChat() {
        const chatContainer = document.querySelector('.wordy-chat');
        chatContainer.innerHTML = '';
        this.diaryId = null; // 새 일기 시작 시 diaryId 초기화
        this.diarySentences = [];
        this.sentenceCount = 0;
        this.init();
    }

    scrollToBottom() {
        const chatContainer = document.querySelector('.wordy-chat');
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    scrollToTop() {
        const chatContainer = document.querySelector('.wordy-chat');
        if (chatContainer) {
            chatContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    handleScroll() {
        const chatContainer = document.querySelector('.wordy-chat');
        if (chatContainer) {
            const isAtBottom = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 10;
            if (isAtBottom) {
                console.log('Scrolled to bottom');
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCSRFToken() {
        const name = 'csrftoken';
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WordyChatbot();
}); 