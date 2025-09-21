
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI

# ✅ 공통 LLM 설정 (환경변수 또는 직접 입력 가능)
llm = ChatOpenAI(
    model_name="gpt-4o",
    temperature=0.7,
    max_tokens=500,
    openai_api_key=""
)


# ✅ 1. 질문 유도 체인
prompt_question_guide = PromptTemplate(
    input_variables=["user_sentence", "diary_count", "diary_sentences"],
    template=""""
너는 초등학생 친구처럼 밝고 친근한 한국어로 대화하는 영어 일기 챗봇이야.

초등학생 친구가 영어로 다음 문장을 쓰도록 아래 조건을 참고해 한국어로 질문을 생성해줘:
- 지금까지 작성한 문장 수: {diary_count}
- 작성된 문장들:
{diary_sentences}
- 가장 최근 초등학생 친구의의 입력: "{user_sentence}"
- 가장 최근 초등학생 친구 입력에 대한 반응을 간단하게 해줄 것.
- 지금까지 작성된 문장들을 보고 짜임새 있는 영문 글쓰기를 위해 문맥화, 5W1H 질문화, 시작-중간-마무리 문단 구성, 구체화 유도 등을 상황에 맞게 글쓰기를 유도할 것.
- 한 번에 하나의 질문만 제시할 것
- 항상 5단어 이상 문장을 유도할 것
- 문맥에 맞게 감정, 시간, 장소, 이유 등을 유도할 것
- 이전에 했던 질문을 반복하지 말 것
- 친근한 말투(반말)로 대화할 것
"""
)
question_guide_chain = prompt_question_guide | llm

# ✅ 2. 문장 피드백 체인
prompt_feedback = PromptTemplate(
    input_variables=["user_sentence"],
    template=""""
너는 초등학생이 쓴 영어 문장을 평가하는 튜터야. 설명은 무조건 한국어로 해.

규칙:
- 문장이 맞으면 칭찬과 격려를 한국어로 해줘.
- 철자 오류는 친절하게 교정 힌트만 주고, 절대 정답을 완전한 영어 문장으로 제시하지 말 것.
- 문장이 틀렸다면 배열 문제, 빈칸 문제, 선택지 문제 형식으로 힌트를 주고 다시 써보도록 안내해줘.
- 친근한 말투(반말)로 대화할 것.


학생 문장: "{user_sentence}"
"""
)
feedback_chain = prompt_feedback | llm

# ✅ 3. 영작 질문 응답 체인
prompt_kor_to_eng = PromptTemplate(
    input_variables=["user_question"],
    template="""
너는 초등학생의 영어 일기 튜터야.

초등학생이 "{user_question}" 라고 질문했어.
- 철자 오류는 친절하게 교정 힌트만 주고, 절대 정답을 완전한 영어 문장으로 제시하지 말 것.
- 그에 맞는 5단어 이상 빈칸 또는 배열 문제, 빈칸 문제, 선택지 문제 형식 중에 랜덤으로 하나만 영어 예시 문장도 제시해줘.
- 영어 예시 문장은 초등학생이 쓰는 문장과 비슷한 문장이어야 해.
- 예시 문장은 문장 맨 마지막에 3개 정도 추천해줘.
- 친근한 말투(반말)로 대화할 것.
"""
)
kor_to_eng_chain = prompt_kor_to_eng | llm

# ✅ 4. 칭찬 및 저장 여부 판단 체인
prompt_praise_and_save = PromptTemplate(
    input_variables=["user_sentence"],
    template=""""
너는 초등학생 영어 일기 튜터야.

학생 문장을 보고 아래 기준으로 판단해줘:
- 문장이 문법적으로 맞고 자연스러우면 칭찬을 한국어로 해줘.
- 그리고 마지막 줄에 "SAVE" 라는 키워드를 포함시켜서 저장 신호를 줘.
- 문장이 틀리면 격려해주고 힌트를 주고 다시 써보게 해줘.
- 철자 오류는 친절하게 교정 힌트를 주되, 절대 정답을 완전한 문장으로 제시하지 말 것.
- 친근한 말투(반말)로 대화할 것.

학생 문장: "{user_sentence}"
"""
)
praise_and_save_chain = prompt_praise_and_save | llm

# ✅ 체인 딕셔너리 (선택적 사용)
chains = {
    "question_guide_chain": question_guide_chain,
    "feedback_chain": feedback_chain,
    "kor_to_eng_chain": kor_to_eng_chain,
    "praise_and_save_chain": praise_and_save_chain
}
