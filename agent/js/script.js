/**
 * 통역 봇 메인 스크립트
 * 실시간 번역 및 UI 관리
 */

// ============================================================================
// 초기화 및 설정
// ============================================================================

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    initLanguageSelection();
    initStartButton();
    initScriptPlayback();
    initTimeUpdate();
    initChatScroll();
    initLogout();
});

// 번역 설정
const LANGUAGE_CODES = {
    '영어': 'en',
    '러시아어': 'ru',
    '중국어': 'zh',
    '일본어': 'ja',
    '베트남어': 'vi'
};

const ORIGINAL_TEXTS = {
    'bot_message1': '계약 체결 시 서명 미이행의 경우,<br>불법 계약으로 인한 손실이 발생할 수 있습니다.<br>계약 체결 시 피보험자가 직접 서명(자기인증 포함)하셨나요?',
    'bot_message2': '당사자와 피보험자 간의 다른 계약에 따른 피보험자의 사망을 보장하는 보험은<br>반드시 피보험자의 서면 동의를 받아야 합니다. 이는 동의하지 않는 경우<br>무효 계약에 해당합니다. 피보험자가 직접 서명(자기인증 포함)하셨나요?',
    'bot_message3': '이해가 안 되시는군요. 그냥 설명드리겠습니다.',
    'user_message1': '네, 맞습니다.',
    'user_message2': '아니요, 서명하지 않았습니다.',
    'user_message3': '이해했습니다.'
};

// ============================================================================
// 번역 기능
// ============================================================================

// 메인 번역 함수
window.translateText = async function(text, targetLanguage) {
    return await translateWithAPI(text, targetLanguage);
};

// API 기반 번역
async function translateWithAPI(text, targetLanguage) {
    try {
        const targetLangCode = LANGUAGE_CODES[targetLanguage];
        if (!targetLangCode) {
            throw new Error(`지원하지 않는 언어: ${targetLanguage}`);
        }

        const cleanText = text.replace(/<br>/g, ' ').replace(/<[^>]*>/g, '');
        const encodedText = encodeURIComponent(cleanText);
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=ko|${targetLangCode}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.responseStatus !== 200) {
            throw new Error(`번역 API 오류: ${result.responseDetails}`);
        }
        
        let translatedText = result.responseData.translatedText;
        
        // HTML 태그 복원
        if (text.includes('<br>')) {
            translatedText = translatedText.replace(/\. /g, '.<br>');
        }
        
        return translatedText;
        
    } catch (error) {
        console.warn('API 번역 실패, 기본 번역 사용:', error);
        return getFallbackTranslation(text, targetLanguage);
    }
}

// 기본 번역 (API 실패 시 사용)
function getFallbackTranslation(text, targetLanguage) {
    console.log('통역 실패 대체 통역.....')
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
    return translations?.[text] || text;
}

// 원본 텍스트 가져오기
function getOriginalText(messageKey) {
    return ORIGINAL_TEXTS[messageKey];
}

// 실시간 번역 업데이트
async function updateTranslations(language) {
    try {
        // 봇 메시지 번역
        const botBubbles = document.querySelectorAll('.bot-message .translation-bubble .message-text');
        for (let i = 0; i < botBubbles.length; i++) {
            const bubble = botBubbles[i];
            const messageKey = `bot_message${i + 1}`;
            const originalText = getOriginalText(messageKey);
            
            if (originalText) {
                const translatedText = await window.translateText(originalText, language);
                bubble.innerHTML = translatedText;
            }
        }
        
        // 사용자 메시지 번역
        const userBubbles = document.querySelectorAll('.user-bubble .message-text');
        for (let i = 0; i < userBubbles.length; i++) {
            const bubble = userBubbles[i];
            const messageKey = `user_message${i + 1}`;
            const originalText = getOriginalText(messageKey);
            
            if (originalText) {
                const translatedText = await window.translateText(originalText, language);
                bubble.innerHTML = translatedText;
            }
        }
    } catch (error) {
        console.error('번역 업데이트 실패:', error);
    }
}

// ============================================================================
// UI 이벤트 핸들러
// ============================================================================

// 언어 선택 기능
function initLanguageSelection() {
    const languageCheckboxes = document.querySelectorAll('.language-checkbox');
    
    languageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // 다른 언어 체크 해제 (단일 선택)
                languageCheckboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });
}

// 통역 시작 버튼
function initStartButton() {
    const startBtn = document.querySelector('.start-btn');
    
    startBtn.addEventListener('click', async function() {
        const selectedLanguage = document.querySelector('.language-checkbox:checked');
        
        if (!selectedLanguage) {
            return;
        }
        
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

// 스크립트 재생 기능
function initScriptPlayback() {
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isPaused = this.classList.contains('paused');
            
            if (isPaused) {
                this.classList.remove('paused');
            } else {
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
    
    updateTime();
    setInterval(updateTime, 1000);
}

// 대화 스크롤 기능
function initChatScroll() {
    const chatMessages = document.querySelector('.chat-messages');
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    window.scrollToBottom = scrollToBottom;
    scrollToBottom();
}

// 로그아웃 기능
function initLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    
    logoutBtn.addEventListener('click', function() {
        if (confirm('정말 로그아웃 하시겠습니까?')) {
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    });
}

// ============================================================================
// 반응형 및 이벤트 처리
// ============================================================================

// 창 크기 변경 시 레이아웃 조정
window.addEventListener('resize', function() {
    const mainContainer = document.querySelector('.main-container');
    
    if (window.innerWidth <= 1024) {
        mainContainer.style.flexDirection = 'column';
    } else {
        mainContainer.style.flexDirection = 'row';
    }
});

// 페이지 가시성 변경 시 시간 업데이트
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
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