// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 언어 선택 기능
    initLanguageSelection();
    
    // 통역시작 버튼 기능
    initStartButton();
    
    // 스크립트 재생 기능
    initScriptPlayback();
    
    // 실시간 시간 업데이트
    initTimeUpdate();
    
    // 대화 스크롤 기능
    initChatScroll();
    
    // 로그아웃 기능
    initLogout();
});

// 언어 선택 초기화
function initLanguageSelection() {
    const languageCheckboxes = document.querySelectorAll('.language-checkbox');
    
    languageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const isChecked = this.checked;
            
            // 다른 언어들 체크 해제 (단일 선택)
            if (isChecked) {
                languageCheckboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });
}

// 실시간 번역 내용 업데이트
async function updateTranslations(language) {
    try {
        // 봇 메시지 번역 업데이트
        const botTranslationBubbles = document.querySelectorAll('.bot-message .translation-bubble .message-text');
        for (let i = 0; i < botTranslationBubbles.length; i++) {
            const bubble = botTranslationBubbles[i];
            const messageKey = `bot_message${i + 1}`;
            const originalText = getOriginalText(messageKey);
            
            if (originalText) {
                // 번역 실행
                const translatedText = await window.translateText(originalText, language);
                bubble.innerHTML = translatedText;
            }
        }
        
        // 사용자 메시지 번역 업데이트
        const userBubbles = document.querySelectorAll('.user-bubble .message-text');
        for (let i = 0; i < userBubbles.length; i++) {
            const bubble = userBubbles[i];
            const messageKey = `user_message${i + 1}`;
            const originalText = getOriginalText(messageKey);
            
            if (originalText) {
                // 번역 실행
                const translatedText = await window.translateText(originalText, language);
                bubble.innerHTML = translatedText;
            }
        }
    } catch (error) {
        // 번역 업데이트 실패
    }
}

// 원본 텍스트 가져오기
function getOriginalText(messageKey) {
    const originalTexts = {
        'bot_message1': '계약 체결 시 서명 미이행의 경우,<br>불법 계약으로 인한 손실이 발생할 수 있습니다.<br>계약 체결 시 피보험자가 직접 서명(자기인증 포함)하셨나요?',
        'bot_message2': '당사자와 피보험자 간의 다른 계약에 따른 피보험자의 사망을 보장하는 보험은<br>반드시 피보험자의 서면 동의를 받아야 합니다. 이는 동의하지 않는 경우<br>무효 계약에 해당합니다. 피보험자가 직접 서명(자기인증 포함)하셨나요?',
        'bot_message3': '이해가 안 되시는군요. 그냥 설명드리겠습니다.',
        'user_message1': '네, 맞습니다.',
        'user_message2': '아니요, 서명하지 않았습니다.',
        'user_message3': '이해했습니다.'
    };
    return originalTexts[messageKey];
}

// 실시간 번역 함수 (대체 번역 시스템만 사용)
window.translateText = async function(text, targetLanguage) {
    return await fallbackTranslation(text, targetLanguage);
};

// 대체 번역 함수 (간단한 매핑)
async function fallbackTranslation(text, targetLanguage) {
    const fallbackTranslations = {
        '영어': {
            '계약 체결 시 서명 미이행의 경우,<br>불법 계약으로 인한 손실이 발생할 수 있습니다.<br>계약 체결 시 피보험자가 직접 서명(자기인증 포함)하셨나요?': 'In case of non-execution of signature during contract conclusion,<br>illegal contract may cause losses.<br>Did the insured personally sign (including self-certification) when concluding the contract?',
            '당사자와 피보험자 간의 다른 계약에 따른 피보험자의 사망을 보장하는 보험은<br>반드시 피보험자의 서면 동의를 받아야 합니다. 이는 동의하지 않는 경우<br>무효 계약에 해당합니다. 피보험자가 직접 서명(자기인증 포함)하셨나요?': 'Insurance guaranteeing the death of the insured under another contract between the Party and the insured<br>must obtain written consent from the insured. This applies to invalid contracts<br>in case of disagreement. Did the insured sign himself (including self-certification)?',
            '이해가 안 되시는군요. 그냥 설명드리겠습니다.': 'You don\'t understand. I\'ll just explain.',
            '네, 맞습니다.': 'Yes, that\'s right.',
            '아니요, 서명하지 않았습니다.': 'No, I didn\'t sign.',
            '이해했습니다.': 'I understand.'
        },
        '러시아어': {
            '계약 체결 시 서명 미이행의 경우,<br>불법 계약으로 인한 손실이 발생할 수 있습니다.<br>계약 체결 시 피보험자가 직접 서명(자기인증 포함)하셨나요?': 'В случае неисполнения подписи во время заключения контракта,<br>незаконный контракт может привести к убыткам.<br>Подписал ли страхователь лично (включая самосертификацию) при заключении договора?',
            '당사자와 피보험자 간의 다른 계약에 따른 피보험자의 사망을 보장하는 보험은<br>반드시 피보험자의 서면 동의를 받아야 합니다. 이는 동의하지 않는 경우<br>무효 계약에 해당합니다. 피보험자가 직접 서명(자기인증 포함)하셨나요?': 'Страхование, гарантирующее смерть страхователя по другому договору между Стороной и страхователем,<br>обязательно должно получить письменное согласие страхователя. Это относится к недействительному договору<br>в случае несогласия. Подписал ли страхователь сам (включая самосертификацию)?',
            '이해가 안 되시는군요. 그냥 설명드리겠습니다.': 'Вы не понимаете. Я просто объясню.',
            '네, 맞습니다.': 'Да, верно.',
            '아니요, 서명하지 않았습니다.': 'Нет, не подписал.',
            '이해했습니다.': 'Понятно.'
        },
        '중국어': {
            '계약 체결 시 서명 미이행의 경우,<br>불법 계약으로 인한 손실이 발생할 수 있습니다.<br>계약 체결 시 피보험자가 직접 서명(자기인증 포함)하셨나요?': '在签订合同时如未执行签名，<br>非法合同可能造成损失。<br>被保险人在签订合同时是否亲自签名（包括自我认证）？',
            '당사자와 피보험자 간의 다른 계약에 따른 피보험자의 사망을 보장하는 보험은<br>반드시 피보험자의 서면 동의를 받아야 합니다. 이는 동의하지 않는 경우<br>무효 계약에 해당합니다. 피보험자가 직접 서명(자기인증 포함)하셨나요?': '在当事人与被保险人之间的另一份合同中保证被保险人死亡的保险<br>必须获得被保险人的书面同意。在不同意的情况下，<br>这适用于无效合同。被保险人是否亲自签名（包括自我认证）？',
            '이해가 안 되시는군요. 그냥 설명드리겠습니다.': '您不理解。我只是解释一下。',
            '네, 맞습니다.': '是的，没错。',
            '아니요, 서명하지 않았습니다.': '不，我没有签名。',
            '이해했습니다.': '我明白了。'
        },
        '일본어': {
            '계약 체결 시 서명 미이행의 경우,<br>불법 계약으로 인한 손실이 발생할 수 있습니다.<br>계약 체결 시 피보험자가 직접 서명(자기인증 포함)하셨나요?': '契約締結時に署名が実行されない場合、<br>違法な契約は損失を引き起こす可能性があります。<br>被保険者は契約締結時に個人的に署名しましたか（自己認証を含む）？',
            '당사자와 피보험자 간의 다른 계약에 따른 피보험자의 사망을 보장하는 보험은<br>반드시 피보험자의 서면 동의를 받아야 합니다. 이는 동의하지 않는 경우<br>무효 계약에 해당합니다. 피보험자가 직접 서명(자기인증 포함)하셨나요?': '当事者と被保険者間の別の契約で被保険者の死亡を保証する保険は、<br>被保険者の書面による同意を得る必要があります。これは不同意の場合の<br>無効な契約に適用されます。被保険者は自分で署名しましたか（自己認証を含む）？',
            '이해가 안 되시는군요. 그냥 설명드리겠습니다.': '理解されないようですね。ただ説明します。',
            '네, 맞습니다.': 'はい、その通りです。',
            '아니요, 서명하지 않았습니다.': 'いいえ、署名していません。',
            '이해했습니다.': '理解しました。'
        },
        '베트남어': {
            '계약 체결 시 서명 미이행의 경우,<br>불법 계약으로 인한 손실이 발생할 수 있습니다.<br>계약 체결 시 피보험자가 직접 서명(자기인증 포함)하셨나요?': 'Trong trường hợp không thực hiện chữ ký khi ký kết hợp đồng,<br>hợp đồng bất hợp pháp có thể gây ra thiệt hại.<br>Người được bảo hiểm có tự ký (bao gồm tự chứng nhận) khi ký kết hợp đồng không?',
            '당사자와 피보험자 간의 다른 계약에 따른 피보험자의 사망을 보장하는 보험은<br>반드시 피보험자의 서면 동의를 받아야 합니다. 이는 동의하지 않는 경우<br>무효 계약에 해당합니다. 피보험자가 직접 서명(자기인증 포함)하셨나요?': 'Bảo hiểm đảm bảo cái chết của người được bảo hiểm theo hợp đồng khác giữa Bên và người được bảo hiểm<br>phải có được sự đồng ý bằng văn bản của người được bảo hiểm. Điều này áp dụng cho hợp đồng không hợp lệ<br>trong trường hợp không đồng ý. Người được bảo hiểm có tự ký (bao gồm tự chứng nhận) không?',
            '이해가 안 되시는군요. 그냥 설명드리겠습니다.': 'Bạn không hiểu. Tôi chỉ giải thích thôi.',
            '네, 맞습니다.': 'Vâng, đúng vậy.',
            '아니요, 서명하지 않았습니다.': 'Không, tôi không ký.',
            '이해했습니다.': 'Tôi hiểu rồi.'
        }
    };
    
    const translations = fallbackTranslations[targetLanguage];
    if (translations && translations[text]) {
        return translations[text];
    }
    
    // 매핑이 없으면 원본 텍스트 반환
    return text;
}

// 통역시작 버튼 초기화
function initStartButton() {
    const startBtn = document.querySelector('.start-btn');
    
    startBtn.addEventListener('click', async function() {
        const selectedLanguage = document.querySelector('.language-checkbox:checked');
        
        if (!selectedLanguage) {
            return;
        }
        
        // 번역 시스템 시작
        const languageText = selectedLanguage.nextElementSibling.nextElementSibling.textContent;
        
        // 언어 배지 업데이트
        const languageBadge = document.querySelector('.language-badge span');
        if (languageBadge) {
            languageBadge.textContent = languageText;
            languageBadge.style.display = 'block';
        }
        
        // 번역 실행
        await updateTranslations(languageText);
    });
}

// 스크립트 재생 기능 초기화
function initScriptPlayback() {
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const scriptItem = this.closest('.script-item');
            const scriptText = scriptItem.querySelector('.script-text').textContent;
            const isPaused = this.classList.contains('paused');
            
            if (isPaused) {
                // 일시정지 해제
                this.classList.remove('paused');
            } else {
                // 재생 시작
                this.classList.add('paused');
            }
        });
    });
}


// 실시간 시간 업데이트
function initTimeUpdate() {
    const chatTime = document.querySelector('.chat-time span');
    
    function updateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        chatTime.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    // 즉시 업데이트
    updateTime();
    
    // 1초마다 업데이트
    setInterval(updateTime, 1000);
}


// 대화 스크롤 기능
function initChatScroll() {
    const chatMessages = document.querySelector('.chat-messages');
    
    // 자동 스크롤 함수
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 전역 함수로 등록
    window.scrollToBottom = scrollToBottom;
    
    // 초기 스크롤
    scrollToBottom();
}

// 로그아웃 기능 초기화
function initLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    
    logoutBtn.addEventListener('click', function() {
        if (confirm('정말 로그아웃 하시겠습니까?')) {
            // 로그아웃 완료
            
            // 로그아웃 시뮬레이션
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    });
}



// 창 크기 변경 시 레이아웃 조정
window.addEventListener('resize', function() {
    // 반응형 레이아웃 조정
    const mainContainer = document.querySelector('.main-container');
    const sidebar = document.querySelector('.sidebar');
    const scriptPanel = document.querySelector('.script-panel');
    
    if (window.innerWidth <= 1024) {
        // 모바일/태블릿 레이아웃
        mainContainer.style.flexDirection = 'column';
    } else {
        // 데스크톱 레이아웃
        mainContainer.style.flexDirection = 'row';
    }
});

// 페이지 가시성 변경 시 처리
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 페이지가 숨겨졌을 때
        // 백그라운드로 이동
    } else {
        // 페이지가 다시 보일 때
        // 포그라운드로 돌아옴
        // 시간 업데이트
        const chatTime = document.querySelector('.chat-time span');
        if (chatTime) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            chatTime.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
    }
});