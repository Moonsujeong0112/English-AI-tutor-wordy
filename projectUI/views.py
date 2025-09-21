import traceback
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import re
import sys
import openai
from .ai_tutor_module import chains
from .models import Diary, DiarySentence

# ai_tutor_module.py의 openai_api_key 사용
openai.api_key = ""

# 1. 위험 단어 리스트 (원하는 만큼 추가/수정 가능)
KOREAN_BLOCKLIST = [
    # 살인/위협 관련
    "죽여", "죽인다", "죽일거야", "죽여버릴거야", "죽음", "죽이고", "죽이고싶어", "죽이고 싶어", "죽이고 싶다", "죽이고 싶었다", "죽였다", "죽였어", "죽일 것이다", "죽이고 싶었어", "죽여버렸다", "죽여버렸어", "죽여버릴 것이다",
    # 해치다 관련
    "해칠거야", "해친다", "해치고 싶어", "해치고 싶었다", "해쳤다", "해쳤어", "해칠 것이다",
    # 자살 관련
    "자살", "자살한다", "자살할거야", "자살하고 싶어", "자살하고 싶었다", "자살했다", "자살했어", "자살할 것이다",
    # 욕설/비하
    "씨발", "씨팔", "좆", "병신", "개새끼", "미친놈", "미친년", "새끼", "염병", "지랄", "꺼져", "fuck", "fucked", "fucking", "shit", "bitch", "bastard", "asshole", "dick", "piss off",
    # 살인/폭력 영어
    "kill", "killed", "killing", "murder", "murdered", "murdering", "slaughter", "slaughtered", "slaughtering", "stab", "stabbed", "stabbing", "harm", "harmed", "harming", "hurt", "hurted", "hurting",
    # 기타 위협
    "죽여버릴게", "죽여버릴께", "죽여버렸어", "죽여버렸다", "죽여버릴거야", "죽여버릴 것이다", "죽여버리고 싶어", "죽여버리고 싶었다", "죽여버리고 싶다"
    # ... 더 추가 가능
]

def moderate_text(text: str) -> dict:
    """
    1. 한국어/영어 위험 단어 리스트로 1차 필터
    2. OpenAI Moderation API로 2차 필터
    """
    # 1차: 위험 단어 필터 (대소문자 구분 없이)
    lowered = text.lower()
    for word in KOREAN_BLOCKLIST:
        if word in lowered:
            return {
                "flagged": True,
                "categories": {"custom_blocklist": True},
                "scores": {"custom_blocklist": 1.0}
            }
    # 2차: OpenAI Moderation
    try:
        client = openai.api_key
        response = client.moderations.create(input=text)
        result = response.results[0]
        return {
            "flagged": result.flagged,
            "categories": result.categories.model_dump(),
            "scores": result.category_scores.model_dump()
        }
    except Exception as e:
        return {"error": str(e)}

def get_content(response):
    if isinstance(response, dict) and "content" in response:
        return response["content"]
    if hasattr(response, "content"):
        return response.content
    return str(response)

# --- HTML 렌더링 뷰 함수들 ---
def chatbot_wordy_view(request):
    return render(request, 'chatbot_wordy.html')

def popup_diary_view(request):
    return render(request, 'popup_diary.html')

def popup_essay_view(request):
    return render(request, 'popup_essay.html')

def main_view(request):
    return render(request, 'main.html')

def main2_view(request):
    return render(request, 'main2.html')

def voca_view(request):
    return render(request, 'voca.html')

def mypage_view(request):
    return render(request, 'mypage.html')

def payment_1_view(request):
    return render(request, 'payment_1.html')

def payment_2_view(request):
    return render(request, 'payment_2.html')

def payment_3_view(request):
    return render(request, 'payment_3.html')

def friend_list_view(request):
    return render(request, 'friend_list.html')

def exchange_diary_view(request):
    return render(request, 'exchange_diary.html')

def bookshelf_view(request):
    return render(request, 'bookshelf.html')

def ch_diary_view(request):
    return render(request, 'change_diary_1.html')

# --- 핵심: 채팅 API (검열 포함) ---
@csrf_exempt
@require_http_methods(["POST"])
def ai_chat_api(request):
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')
        diary_sentences = data.get('diary_sentences', [])
        diary_id = data.get('diary_id')
        mode = data.get('mode', 'auto')

        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        # 1. 사용자 입력 검열
        moderation_user = moderate_text(user_message)
        print("Moderation result:", moderation_user)
        if moderation_user.get("flagged"):
            return JsonResponse({
                "blocked": True,
                "message": "❗️부적절한 표현이 감지되었어요. 다시 말해볼까?",
                "target": "user_input",
                "moderation": moderation_user
            }, status=403)

        def is_english_sentence(text):
            return bool(re.fullmatch(r"[a-zA-Z0-9 .,!?\"'\\-]+", text.strip()))
        def is_question(text):
            keywords = ["영어로", "어떻게", "뭐예요", "말해줘", "모르겠어"]
            return any(k in text for k in keywords)

        user_id = request.user.username if hasattr(request, 'user') and request.user.is_authenticated else None
        # 2. Diary(일기) 객체 준비
        diary = None
        if not diary_id:
            diary = Diary.objects.create(user_id=user_id)
            diary_id = diary.id
        else:
            try:
                diary = Diary.objects.get(id=diary_id)
            except Diary.DoesNotExist:
                return JsonResponse({'error': 'Invalid diary_id: Diary does not exist'}, status=400)

        # 3. 일기 완성 여부 체크
        if diary is not None:
            correct_count = DiarySentence.objects.filter(diary=diary, is_correct=True).count()
            if correct_count >= 10:
                sentences_correct = list(DiarySentence.objects.filter(diary=diary, is_correct=True).order_by('order').values('original_sentence', 'is_correct', 'feedback'))
                diary_text = "\n".join([s['original_sentence'] for s in sentences_correct])
                return JsonResponse({
                    'success': True,
                    'conversation': "일기가 이미 완성되었습니다! 내일 또 멋진 일기를 써보자 :)",
                    'is_savable': False,
                    'is_retry': False,
                    'diary_sentences': [s['original_sentence'] for s in sentences_correct],
                    'sentence_count': correct_count,
                    'diary_id': diary.id,
                    'sentences_all': list(DiarySentence.objects.filter(diary=diary).order_by('order').values('original_sentence', 'is_correct', 'feedback')),
                    'sentences_correct': sentences_correct
                })

        # 4. AI 체인 분기 및 응답 생성
        if is_question(user_message):
            response = chains["kor_to_eng_chain"].invoke({"user_question": user_message})
            gpt_response = get_content(response)
        elif is_english_sentence(user_message):
            variables = {"user_sentence": user_message}
            response = chains["praise_and_save_chain"].invoke(variables)
            gpt_response = get_content(response)
        else:
            response = chains["kor_to_eng_chain"].invoke({"user_question": user_message})
            gpt_response = get_content(response)

        # 5. GPT 응답 검열
        moderation_response = moderate_text(gpt_response)
        if moderation_response.get("flagged"):
            return JsonResponse({
                "blocked": True,
                "message": "⚠️ GPT 응답이 부적절하여 출력할 수 없어요.",
                "target": "gpt_response",
                "moderation": moderation_response
            }, status=403)

        # 6. 기존 로직에 따라 응답/저장 처리
        is_savable = "SAVE" in gpt_response if is_english_sentence(user_message) else False
        is_retry = not is_savable if is_english_sentence(user_message) else False
        conversation = gpt_response

        if is_english_sentence(user_message):
            if is_savable:
                diary_sentences.append(user_message)
                DiarySentence.objects.create(
                    user_id=user_id,
                    diary=diary,
                    original_sentence=user_message,
                    corrected_sentence="",
                    is_correct=is_savable,
                    feedback=conversation,
                    order=len(diary_sentences)
                )
                if len(diary_sentences) == 10:
                    sentences_correct = DiarySentence.objects.filter(
                        diary=diary, is_correct=True
                    ).order_by('order')
                    diary_text = "\n".join([s.original_sentence for s in sentences_correct])
                    diary.entire_diary = diary_text
                    if not diary.title:
                        diary.title = "Wordy 일기 - " + datetime.today().strftime("%Y-%m-%d")
                    diary.save()
                    conversation = (
                        "\n\n일기가 완성됐어! 네가 쓴 오늘의 일기야:\n\n" +
                        diary_text +
                        "\n\n수고했어! 내일도 멋진 일기를 써보자 :)"
                    )
                else:
                    guide_vars = {
                        "user_sentence": user_message,
                        "diary_count": len(diary_sentences),
                        "diary_sentences": "\n".join(diary_sentences)
                    }
                    guide_response = chains["question_guide_chain"].invoke(guide_vars)
                    conversation = get_content(guide_response)
                    if len(diary_sentences) == 9:
                        finish_msg = "\n\n이제 일기 마무리를 해볼까? 오늘 하루를 마무리하는 느낌으로 적어줘! (예: 오늘 하루를 돌아보며 느낀 점, 내일의 다짐 등)"
                        conversation = conversation + finish_msg
            else:
                feedback = chains["feedback_chain"].invoke({"user_sentence": user_message})
                conversation = get_content(feedback)

        sentences_all = list(DiarySentence.objects.filter(diary=diary).order_by('order').values('original_sentence', 'is_correct', 'feedback'))
        sentences_correct = list(DiarySentence.objects.filter(diary=diary, is_correct=True).order_by('order').values('original_sentence', 'is_correct', 'feedback'))

        return JsonResponse({
            'success': True,
            'conversation': conversation,
            'is_savable': is_savable,
            'is_retry': is_retry,
            'diary_sentences': diary_sentences,
            'sentence_count': len(diary_sentences),
            'diary_id': diary_id,
            'sentences_all': sentences_all,
            'sentences_correct': sentences_correct
        })

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        tb = traceback.format_exc()
        print(tb, file=sys.stderr)
        return JsonResponse({
            'error': f'Server error: {str(e)}',
            'traceback': tb
        }, status=500)

@require_http_methods(["GET"])
def ai_chat_init(request):
    try:
        initial_data = {
            'success': True,
            'conversation': "Hello~ 나는 너의 영어 글쓰기 도움이 워디야! 오늘은 무슨 일이 있었어?",
            'is_savable': False,
            'is_retry': False,
            'diary_sentences': [],
            'sentence_count': 0,
            'diary_id': None
        }
        return JsonResponse(initial_data)
    except Exception as e:
        tb = traceback.format_exc()
        return JsonResponse({
            'error': f'Server error: {str(e)}',
            'traceback': tb
        }, status=500) 