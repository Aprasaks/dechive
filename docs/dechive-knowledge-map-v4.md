# Dechive Knowledge 개념 지도 (v4 · 확정본)

> 기준일: 2026년 7월 26일
> 이 문서는 Knowledge에 담을 AI 개념의 전체 목록과, 그 배열 원칙을 정의한다.
> v4에서 확정한 것: 완결성 우선 원칙, 4개 층 구조, 새 개념 추가 절차, 누락 개념 보강.

---

# 1부. 원칙

## 1. Knowledge가 무엇인가

AI를 배우는 데 필요한 개념을 **처음부터 끝까지 전부** 담는 개념 저장소다. 특정 커리큘럼이 아니라, 무엇이든 찾아볼 수 있는 평면적 아카이브다.

- 글의 길이는 제약이 아니다. 완전성과 정확성이 우선이다.
- 아무 항목이나 열어도 성립해야 한다. 앞의 글을 읽었다는 전제를 두지 않는다.
- 새 개념이 이름을 얻으면 계속 추가한다. 저장소는 축소하지 않는다.

## 2. 완결성 원칙 (v4에서 확정)

이전 문서에는 "이미 작성한 개념은 다른 글에서 다시 쓰지 않고 연결한다"는 규칙이 있었다. **이 규칙은 폐기한다.** 완전성과 충돌하며, 글마다 설명을 빼먹게 만들었다.

대신 다음을 따른다.

> **제목이 계약이다. 각 글은 자기 제목에 완결로 답한다.**
>
> 다른 글이 있는 개념이라도, 이 글의 제목에 답하는 데 필요하면 여기서 설명한다.
> 다만 그 개념의 전용 글만큼 깊게 들어가지는 않는다. 필요한 만큼만 설명하고 연결한다.

판단 질문은 하나다.

**"이걸 빼면 이 제목에 대한 답이 불완전해지나?"**

- 그렇다 → 넣는다. 다른 글에 있어도 넣는다.
- 아니다 → 이름만 주고 넘긴다.

예시 — `머신러닝이란 무엇인가`의 경우
- 자기지도학습: 머신러닝의 갈래다. 빼면 갈래가 불완전 → **넣는다**
- 특징(feature): 무엇으로 배우는지의 핵심 → **넣는다**
- 과적합: 학습 성공의 판단 기준 → **넣는다**
- 경사하강법의 수식: 머신러닝이 무엇인지 아는 데 불필요 → **이름만**

## 3. 이름 규칙

개념을 설명했으면 **정식 명칭을 반드시 밝힌다.** "내부 수치를 조정한다"까지만 쓰고 파라미터라는 말을 주지 않으면, 독자는 나가서 그 단어를 만났을 때 연결하지 못한다. 사전이 용어를 숨기면 사전이 아니다.

쉬운 말로 먼저 설명하고, 그 다음 정식 명칭을 붙이는 순서가 좋다.

## 4. 글의 형식

- 제목에 해당하는 정의로 시작한다. 요약 박스는 두지 않는다. (CMS 요약이 그 역할)
- 소제목으로 잘라 목차가 되게 한다. 각 섹션은 독립적으로 읽힌다.
- 마지막에 `흔한 오해`와 `확인한 자료`를 둔다.
- 연습문제·체크포인트·마무리 정리는 넣지 않는다. 그것은 Lecture와 Practice의 몫이다.
- 아직 발행되지 않은 글에는 링크하지 않는다. 굵은 글씨로 두었다가 발행 후 연결한다.

## 5. 작성 전 4관문

1. 이 개념을 내 말로, 비유 하나 들어서 설명할 수 있나?
2. 이게 왜 필요한가 — 없으면 뭐가 안 되는지 말할 수 있나?
3. AI가 이 주제에서 자주 틀리는 지점을 하나 아나?
4. 내가 직접 확인한 출처가 있나?

하나라도 막히면 아직 쓸 때가 아니다. 무엇을 공부해야 하는지 알려주는 신호다.

---

# 2부. 배열 원칙

## 왜 이 순서인가

전체는 **4개의 층**으로 쌓여 있다. 아래 층을 모르면 위 층이 이해되지 않는 순서다.

```
4층 — 책임과 운영    안전 · 평가 · 운영 · 개발 · 응용 · 사회
                     (만든 것을 지키고, 재고, 굴리고, 넓힌다)
        ▲
3층 — 시스템 구축    API/Tool · RAG · Workflow · Agent · MCP · Loop/Graph
                     (모델을 재료로 실제 시스템을 만든다)
        ▲
2층 — 사용과 검증    Prompt/Context · 검증
                     (모델과 대화하고, 그 답을 믿을지 판단한다)
        ▲
1층 — 기초 원리      조감도 · 학습 · 신경망 · 생성모델 · LLM
                     (기계가 어떻게 배우고 만들어내는가)
```

## 층 안에서의 순서

각 영역 안은 대체로 이 흐름을 따른다.

**정의 → 재료 → 작동 방식 → 변형과 종류 → 한계와 실패**

예를 들어 2영역(학습)은 데이터가 무엇인지(재료) → 어떻게 배우는지(작동) → 어떤 갈래가 있는지(종류) → 왜 실패하는지(한계) 순이다.

## 새 개념을 어디에 넣을 것인가

AI가 계속 바뀌므로 이 목록은 계속 자란다. 새 개념이 나왔을 때 다음 순서로 판단한다.

**1단계 — Knowledge에 넣을 것인가?**
- 이름이 붙은 사고방식·구조·기법인가 → Knowledge
- 특정 모델·제품·버전·점수인가 → AI Update (Knowledge는 건드리지 않는다)

**2단계 — 어느 층인가?**
- 기계가 배우고 만들어내는 원리에 관한 것 → 1층
- 모델에 무엇을 넣고 그 답을 어떻게 판단하는가 → 2층
- 모델을 재료로 시스템을 만드는 것 → 3층
- 만든 것을 지키고 재고 굴리는 것 → 4층

**3단계 — 어느 영역인가?**
그 층 안에서 가장 가까운 주제의 영역에 넣는다.

**4단계 — 영역 안 어디인가?**
- 이 개념을 이해하려면 먼저 알아야 할 개념이 무엇인가?
- 그것들이 모두 나온 뒤에 배치한다.

**새 영역은 언제 만드는가**
기존 어느 영역에도 자연스럽게 들어가지 않고, 묶일 개념이 다섯 개 이상일 때만 만든다. 하나 때문에 영역을 만들지 않는다.

**의존성이 어긋나면 영역째 옮긴다**
14영역(안전)이 원래 8영역이었다가 뒤로 간 것이 그 예다. Tool·Agent·Memory·Loop 수준의 위협은 그 개념들이 정의된 뒤라야 이해된다.

---

# 3부. 전체 개념 목록

총 19영역. 각 항목이 하나의 Knowledge 글이다.

---

# 1층 — 기초 원리

## 1영역. AI 전체를 먼저 바라보기

처음 온 사람이 AI 세계의 윤곽을 잡는 구간. 넓고 얕게 훑는다.

1. 인공지능이란 무엇인가
2. 머신러닝이란 무엇인가
3. 딥러닝이란 무엇인가
4. 판별형 AI와 생성형 AI는 무엇이 다른가
5. 데이터·알고리즘·모델은 무엇인가
6. 학습과 추론은 무엇이 다른가
7. AI의 출력이 확률적이라는 것은 무슨 뜻인가
8. Foundation Model이란 무엇인가
9. 대규모 언어 모델이란 무엇인가
10. 멀티모달 AI란 무엇인가
11. AI 모델과 AI 시스템은 무엇이 다른가
12. 인공지능은 어떻게 발전해왔는가
13. AI가 할 수 있는 것과 할 수 없는 것

12번은 세 번의 물결과 두 번의 AI 겨울을 다룬다. 지금의 방식이 왜 이렇게 굳었는지 이해하려면 필요하다.

---

## 2영역. AI가 학습한다는 것 이해하기

기계가 데이터로부터 규칙을 만들어내는 과정 전체.

### 데이터라는 재료
1. Dataset이란 무엇인가
2. Feature와 Label은 무엇인가
3. 데이터 수집과 라벨링이란 무엇인가
4. 데이터 전처리와 정제란 무엇인가
5. Feature Engineering이란 무엇인가
6. 데이터 증강이란 무엇인가
7. 클래스 불균형이란 무엇인가
8. 데이터 품질은 왜 모델 성능을 좌우하는가

### 학습의 갈래
9. 머신러닝 워크플로우란 무엇인가
10. 지도학습이란 무엇인가
11. 비지도학습이란 무엇인가
12. 자기지도학습이란 무엇인가
13. 준지도학습이란 무엇인가
14. 강화학습이란 무엇인가
15. 분류·회귀·군집화는 무엇이 다른가

### 신경망 이외의 방법
16. 선형 회귀와 로지스틱 회귀란 무엇인가
17. 결정 트리란 무엇인가
18. 앙상블·랜덤 포레스트·Gradient Boosting이란 무엇인가
19. Support Vector Machine이란 무엇인가
20. k-최근접 이웃(kNN)이란 무엇인가
21. k-평균 군집화란 무엇인가
22. 차원 축소와 PCA란 무엇인가
23. 차원의 저주란 무엇인가

### 어떻게 배우는가
24. 손실 함수란 무엇인가
25. 최적화란 무엇인가
26. 경사하강법이란 무엇인가
27. Parameter와 Hyperparameter는 무엇이 다른가
28. Hyperparameter Tuning이란 무엇인가

### 잘 배웠는지 어떻게 아는가
29. 학습·검증·테스트 데이터는 무엇이 다른가
30. 교차 검증이란 무엇인가
31. 일반화란 무엇인가
32. 과적합과 과소적합은 무엇인가
33. 정규화(Regularization)와 L1·L2란 무엇인가
34. Bias와 Variance는 어떤 관계인가
35. Data Leakage란 무엇인가
36. 머신러닝 모델은 어떻게 평가하는가
37. 혼동행렬과 정밀도·재현율·F1이란 무엇인가

### 학습의 방식
38. Batch Learning과 Online Learning은 무엇이 다른가
39. Active Learning이란 무엇인가
40. Transfer Learning이란 무엇인가

---

## 3영역. 신경망과 딥러닝 이해하기

층을 쌓아 표현을 배우는 방식.

### 신경망의 기본
1. 인공신경망이란 무엇인가
2. 뉴런·가중치·Bias란 무엇인가
3. 신경망의 Layer란 무엇인가
4. 활성화 함수란 무엇인가
5. 가중치 초기화란 무엇인가

### 학습이 일어나는 과정
6. Forward Pass란 무엇인가
7. Backpropagation이란 무엇인가
8. Gradient Vanishing과 Exploding이란 무엇인가
9. Optimizer란 무엇인가
10. Batch·Epoch·Learning Rate란 무엇인가

### 깊게 쌓기 위한 장치
11. Batch Normalization과 Layer Normalization이란 무엇인가
12. Dropout과 딥러닝의 정규화란 무엇인가
13. Residual Connection이란 무엇인가
14. Representation Learning이란 무엇인가

### 구조
15. Encoder와 Decoder란 무엇인가
16. CNN이란 무엇인가
17. RNN·LSTM·GRU란 무엇인가
18. Transformer란 무엇인가
19. Attention이란 무엇인가
20. Self-Attention과 Cross-Attention은 무엇이 다른가
21. Multi-Head Attention이란 무엇인가
22. Positional Encoding이란 무엇인가
23. Attention의 계산 비용과 효율화란 무엇인가
24. State Space Model이란 무엇인가

### 규모의 문제
25. GPU와 AI 가속기는 왜 필요한가
26. 분산 학습이란 무엇인가
27. Scaling Law란 무엇인가

---

## 4영역. 생성 모델 이해하기

새로운 데이터를 만들어내는 모델들.

1. 생성 모델이란 무엇인가
2. Autoregressive Model이란 무엇인가
3. Latent Space란 무엇인가
4. Autoencoder와 VAE란 무엇인가
5. GAN이란 무엇인가
6. Diffusion Model이란 무엇인가
7. Flow Matching이란 무엇인가
8. Consistency Model이란 무엇인가
9. Diffusion Transformer란 무엇인가
10. Conditioning이란 무엇인가
11. Classifier-free Guidance란 무엇인가
12. Sampling이란 무엇인가
13. Seed란 무엇인가
14. Synthetic Data란 무엇인가
15. 생성 모델의 품질과 다양성은 왜 충돌하는가

---

## 5영역. LLM이 답을 만드는 과정 이해하기

가장 두꺼운 영역. 언어를 다루는 모델이 만들어지고 답을 내놓기까지.

### 언어를 숫자로
1. 언어 모델이란 무엇인가
2. Corpus란 무엇인가
3. 토큰이란 무엇인가
4. Tokenization이란 무엇인가
5. Vocabulary란 무엇인가
6. Embedding이란 무엇인가
7. 다음 토큰 예측이란 무엇인가
8. Perplexity란 무엇인가

### 만들어지는 과정
9. Pre-training이란 무엇인가
10. Post-training이란 무엇인가
11. Fine-tuning이란 무엇인가
12. Supervised Fine-tuning이란 무엇인가
13. Instruction Tuning이란 무엇인가

### 사람의 의도에 맞추기
14. AI Alignment란 무엇인가
15. Reward Model이란 무엇인가
16. RLHF란 무엇인가
17. DPO와 Preference Optimization이란 무엇인가
18. RLAIF와 Constitutional AI란 무엇인가
19. 검증 가능한 보상 기반 강화학습이란 무엇인가
20. Process Reward Model과 Outcome Reward Model은 무엇이 다른가

### 모델을 다루는 기술
21. PEFT와 LoRA란 무엇인가
22. Knowledge Distillation이란 무엇인가
23. Model Merging이란 무엇인가
24. Quantization이란 무엇인가
25. Mixture of Experts란 무엇인가

### 무엇을 얼마나 볼 수 있는가
26. Context Window란 무엇인가
27. KV Cache란 무엇인가
28. Long-context Model이란 무엇인가

### 더 오래 생각하기
29. Reasoning Model이란 무엇인가
30. Test-time Compute란 무엇인가
31. Chain-of-Thought란 무엇인가
32. Self-Consistency란 무엇인가
33. Extended Thinking이란 무엇인가

### 답이 나오는 순간
34. Decoding이란 무엇인가
35. Temperature·Top-k·Top-p란 무엇인가
36. Speculative Decoding이란 무엇인가
37. LLM은 왜 같은 질문에도 다른 답을 만드는가
38. LLM은 왜 환각을 일으키는가

### 모델의 공개 방식
39. Open Model·Open-weight·Closed Model은 무엇이 다른가

---

# 2층 — 사용과 검증

## 6영역. Prompt와 Context 이해하기

모델에 무엇을 어떻게 넣는가.

1. 프롬프트란 무엇인가
2. System·Developer·User·Assistant 메시지는 무엇이 다른가
3. 지시·맥락·입력·출력 형식은 어떻게 다른가
4. Zero-shot Prompting이란 무엇인가
5. Few-shot Prompting이란 무엇인가
6. Prompt Template이란 무엇인가
7. AI의 출력 형식을 지정한다는 것은 무엇인가
8. Context란 무엇인가
9. Context Engineering이란 무엇인가
10. 긴 Context가 항상 좋은 것은 아닌 이유
11. Context Compaction이란 무엇인가
12. Context Offloading이란 무엇인가
13. Prompt Chaining이란 무엇인가
14. Meta Prompting과 프롬프트 자동 최적화란 무엇인가
15. Prompt Sensitivity란 무엇인가
16. Instruction Hierarchy란 무엇인가
17. Multimodal Prompt란 무엇인가

---

## 7영역. AI의 답을 검증하기 위한 개념

Dechive의 중심 영역. 다른 어느 곳에도 잘 정리돼 있지 않다.

1. 주장·근거·추론은 무엇이 다른가
2. 사실·의견·예측은 무엇이 다른가
3. 1차 출처와 2차 출처는 무엇이 다른가
4. 출처가 있다는 것과 검증됐다는 것은 무엇이 다른가
5. Source Grounding이란 무엇인가
6. Citation Grounding이란 무엇인가
7. 교차 검증이란 무엇인가
8. 여러 AI가 같은 답을 하면 사실이라고 볼 수 있는가
9. 정보의 최신성이란 무엇인가
10. 재현 가능성이란 무엇인가
11. 검증 가능성이란 무엇인가
12. 불확실성과 Confidence는 무엇이 다른가
13. Calibration이란 무엇인가
14. Automation Bias란 무엇인가
15. Confirmation Bias는 AI 사용에 어떤 영향을 주는가
16. 반증 가능성이란 무엇인가
17. 어떤 AI 답변을 어디까지 검증해야 하는가

---

# 3층 — 시스템 구축

## 8영역. API와 Tool 이해하기

모델을 프로그램에서 부르는 방법. HTTP와 JSON은 AI 개념이 아니므로 필요할 때 참고하는 선수 지식으로 본다.

1. API란 무엇인가
2. LLM API란 무엇인가
3. API 요청과 모델 응답은 어떻게 구성되는가
4. Message와 Conversation State란 무엇인가
5. Token Usage와 API 비용은 어떤 관계인가
6. Rate Limit이란 무엇인가
7. Streaming Response란 무엇인가
8. Webhook과 비동기 처리란 무엇인가
9. Prompt Caching이란 무엇인가
10. Batch Inference란 무엇인가
11. Structured Output이란 무엇인가
12. JSON Schema는 AI 출력에서 어떤 역할을 하는가
13. Constrained Decoding이란 무엇인가
14. Function Calling이란 무엇인가
15. Tool Calling이란 무엇인가
16. Function Calling과 Tool Calling은 무엇이 다른가
17. Tool Schema란 무엇인가
18. Tool Result는 어떻게 다시 Context가 되는가
19. API Error와 Model Error는 무엇이 다른가
20. Model Routing이란 무엇인가
21. Model Fallback이란 무엇인가

---

## 9영역. Retrieval과 RAG 이해하기

모델 바깥의 지식을 끌어와 답에 쓰는 방법.

### 왜 필요한가
1. 모델 내부 지식과 외부 지식은 무엇이 다른가
2. Information Retrieval이란 무엇인가
3. RAG란 무엇인가
4. RAG와 Fine-tuning은 무엇이 다른가
5. RAG와 Memory는 무엇이 다른가

### 문서를 준비하기
6. Document Ingestion이란 무엇인가
7. Parsing이란 무엇인가
8. OCR이란 무엇인가
9. Chunking이란 무엇인가
10. Indexing이란 무엇인가

### 찾아내기
11. Vector란 무엇인가
12. Vector Search란 무엇인가
13. Vector Database란 무엇인가
14. Cosine Similarity란 무엇인가
15. Sparse Retrieval이란 무엇인가
16. Dense Retrieval이란 무엇인가
17. Hybrid Search란 무엇인가
18. Metadata Filtering이란 무엇인가

### 정확도를 높이기
19. Query Transformation이란 무엇인가
20. Multi-query Retrieval이란 무엇인가
21. Reranking이란 무엇인가
22. Contextual Retrieval이란 무엇인가

### 답으로 만들기
23. 검색 결과를 Context로 구성한다는 것은 무엇인가
24. Grounded Generation이란 무엇인가

### 확장된 형태
25. Graph RAG란 무엇인가
26. Multimodal RAG란 무엇인가
27. Agentic RAG란 무엇인가

### 한계
28. RAG는 왜 실패하는가
29. RAG는 환각을 완전히 없앨 수 있는가

---

## 10영역. Workflow와 Automation 이해하기

정해진 흐름으로 여러 단계를 잇는 방법.

1. AI Workflow란 무엇인가
2. 자동화와 AI 자동화는 무엇이 다른가
3. Workflow와 Agent는 무엇이 다른가
4. 결정론적 Workflow와 확률적 Workflow는 무엇이 다른가
5. Trigger와 Event란 무엇인가
6. 순차 실행과 병렬 실행은 무엇이 다른가
7. Branching과 Routing이란 무엇인가
8. State란 무엇인가
9. State Machine이란 무엇인가
10. Idempotency란 무엇인가
11. Human-in-the-loop란 무엇인가
12. Orchestration이란 무엇인가
13. AI Workflow는 왜 실패하는가

---

## 11영역. Agent 이해하기

스스로 판단하며 도구를 쓰는 시스템.

### 무엇인가
1. AI Agent란 무엇인가
2. Agentic System이란 무엇인가
3. Chatbot·Assistant·Agent는 무엇이 다른가
4. Agent Loop란 무엇인가

### 무엇을 향해 움직이는가
5. Goal과 Task는 무엇이 다른가
6. Agent의 Planning이란 무엇인가
7. Plan-and-Execute 패턴이란 무엇인가
8. ReAct 패턴이란 무엇인가
9. Reflection이란 무엇인가

### 무엇으로 움직이는가
10. Agent의 Tool과 Action이란 무엇인가
11. Agent의 Observation이란 무엇인가
12. Agent Skill이란 무엇인가
13. Agent State란 무엇인가
14. Agent Memory란 무엇인가
15. Short-term Memory와 Long-term Memory는 무엇이 다른가
16. Stop Condition이란 무엇인가
17. Agent의 자율성 수준이란 무엇인가

### 여럿이 함께
18. Single-agent와 Multi-agent는 무엇이 다른가
19. Subagent란 무엇인가
20. Delegation과 Handoff란 무엇인가
21. Agent Communication이란 무엇인가

### 어디서 움직이는가
22. Agent Environment란 무엇인가
23. Agent Harness란 무엇인가
24. Long-running Agent란 무엇인가
25. Computer-use Agent란 무엇인가
26. Browser Agent란 무엇인가
27. Coding Agent란 무엇인가

### 한계
28. Agent는 왜 실패하는가
29. Trustworthy Agent란 무엇인가

---

## 12영역. MCP와 Agent 상호운용성 이해하기

서로 다른 AI 시스템과 도구를 잇는 표준.

1. AI 상호운용성이란 무엇인가
2. MCP란 무엇인가
3. MCP는 왜 등장했는가
4. MCP Host·Client·Server는 무엇이 다른가
5. MCP Tool이란 무엇인가
6. MCP Resource란 무엇인가
7. MCP Prompt란 무엇인가
8. MCP Sampling이란 무엇인가
9. MCP Elicitation이란 무엇인가
10. MCP Transport란 무엇인가
11. MCP Capability Negotiation이란 무엇인가
12. MCP Tool Discovery란 무엇인가
13. MCP Authorization이란 무엇인가
14. MCP와 일반 API는 무엇이 다른가
15. MCP와 Function Calling은 무엇이 다른가
16. MCP에는 어떤 보안 위험이 있는가
17. A2A란 무엇인가
18. MCP와 A2A는 무엇이 다른가
19. Agent Card와 Capability Discovery란 무엇인가
20. Agent Protocol의 Versioning과 Governance란 무엇인가

버전별 기능 변화는 AI Update에서 추적하고, 여기서는 프로토콜의 목적과 구조를 다룬다.

---

## 13영역. Loop와 Graph 설계 이해하기

현재의 프런티어. 2026년 6월 이후 프롬프트 엔지니어링에서 루프 엔지니어링으로 중심이 옮겨갔고, 7월 중순부터 그래프 엔지니어링이 그 위층으로 제시됐다.

### 무엇이 바뀌었는가
1. 프롬프트 엔지니어링에서 루프 엔지니어링으로 — 무엇이 바뀌었는가
2. Loop Engineering이란 무엇인가
3. 에이전트는 이미 루프 안에서 돈다 — 루프를 설계 대상으로 본다는 것

### 루프를 설계한다는 것
4. 루프 설계의 네 요소: Trigger·Topology·Verifier·Stop Rule
5. Heartbeat Loop란 무엇인가
6. Cron Loop란 무엇인가
7. Hook Loop란 무엇인가
8. Goal Loop란 무엇인가
9. Self-prompting이란 무엇인가
10. 내부·개발자·외부 피드백 루프는 무엇이 다른가

### 루프를 통제한다는 것
11. 루프의 Verifier란 무엇인가
12. 루프 폭주와 토큰 예산 제어란 무엇인가
13. 루프에서 사람은 언제 개입하는가
14. Loop Observability란 무엇인가

### 여러 에이전트를 잇는다는 것
15. Graph Engineering이란 무엇인가
16. Agent Graph의 노드와 엣지란 무엇인가
17. 정적 그래프와 동적 그래프는 무엇이 다른가
18. 멀티 에이전트 조직을 프로그래밍한다는 것은 무엇인가
19. Loop·Graph 설계는 왜 실패하는가

---

# 4층 — 책임과 운영

## 14영역. AI 안전과 보안 이해하기

Tool·Agent·Memory·Loop 수준의 위협을 다루므로 그 개념들이 정의된 뒤에 온다.

### 무엇을 지키는가
1. AI Safety와 AI Security는 무엇이 다른가

### 공격의 종류
2. Prompt Injection이란 무엇인가
3. Direct와 Indirect Prompt Injection은 무엇이 다른가
4. Jailbreak란 무엇인가
5. Adversarial Example이란 무엇인가
6. Data Poisoning이란 무엇인가
7. Backdoor와 Sleeper Agent란 무엇인가
8. Context Poisoning이란 무엇인가
9. Memory Poisoning이란 무엇인가
10. Tool Poisoning이란 무엇인가
11. Sensitive Information Disclosure란 무엇인가
12. Insecure Output Handling이란 무엇인가
13. Excessive Agency란 무엇인가

### 방어의 수단
14. Guardrail이란 무엇인가
15. Input Validation과 Output Validation이란 무엇인가
16. Output Filtering이란 무엇인가
17. Sandboxing이란 무엇인가
18. 최소 권한 원칙이란 무엇인가
19. Human Approval Gate란 무엇인가

### 미리 찾아내기
20. AI Threat Modeling이란 무엇인가
21. AI Red Teaming이란 무엇인가
22. Alignment Faking이란 무엇인가
23. AI Supply-chain Risk란 무엇인가

---

## 15영역. Evaluation과 Benchmark 이해하기

잘하는지 어떻게 재는가.

### 무엇으로 재는가
1. AI Evaluation이란 무엇인가
2. Metric과 Evaluation Criteria는 무엇이 다른가
3. Rubric이란 무엇인가
4. Test Case란 무엇인가
5. Golden Dataset이란 무엇인가

### 공개 점수를 읽는 법
6. Benchmark란 무엇인가
7. 공개 Benchmark 점수는 어떻게 봐야 하는가
8. Benchmark와 실제 사용 경험은 왜 다른가
9. Benchmark Contamination이란 무엇인가
10. Benchmark Saturation이란 무엇인가

### 누가 재는가
11. Programmatic Evaluation이란 무엇인가
12. Human Evaluation이란 무엇인가
13. LLM-as-a-Judge란 무엇인가
14. Pairwise Evaluation이란 무엇인가
15. Reference-based와 Reference-free Evaluation은 무엇이 다른가

### 무엇을 재는가
16. Offline과 Online Evaluation은 무엇이 다른가
17. RAG Evaluation이란 무엇인가
18. Agent Evaluation이란 무엇인가
19. Tool-use Evaluation이란 무엇인가
20. Safety Evaluation이란 무엇인가

### 계속 재기
21. Regression Evaluation이란 무엇인가
22. Continuous Evaluation이란 무엇인가

### 재는 일의 한계
23. 평가의 통계적 불확실성이란 무엇인가
24. 평가 데이터의 대표성과 편향이란 무엇인가

---

## 16영역. AI 시스템 운영 이해하기

만든 것을 실제로 굴리는 일.

1. MLOps와 LLMOps는 무엇이 다른가
2. AI Observability란 무엇인가
3. Logging·Metrics·Tracing은 무엇이 다른가
4. Agent Trace란 무엇인가
5. Model Serving이란 무엇인가
6. 추론 최적화와 배칭이란 무엇인가
7. Latency란 무엇인가
8. Throughput과 Concurrency는 무엇이 다른가
9. Reliability와 Availability는 무엇이 다른가
10. Retry·Backoff·Timeout이란 무엇인가
11. Circuit Breaker란 무엇인가
12. Checkpoint란 무엇인가
13. Failure Recovery란 무엇인가
14. 비용·속도·품질은 어떤 관계인가
15. Model Versioning이란 무엇인가
16. Prompt Versioning이란 무엇인가
17. Model Drift와 Data Drift란 무엇인가
18. Canary와 A/B Test란 무엇인가
19. AI Incident란 무엇인가
20. Rollback과 Kill Switch란 무엇인가

---

## 17영역. AI-native Development 이해하기

AI로 소프트웨어를 만드는 방식 자체의 변화.

1. AI-native Development란 무엇인가
2. AI Coding Assistant란 무엇인가
3. AI Coding Assistant와 Coding Agent는 무엇이 다른가
4. Vibe Coding이란 무엇인가
5. Conversation Coding이란 무엇인가
6. Specification-driven Development란 무엇인가
7. Repository Context란 무엇인가
8. Repository Instruction File이란 무엇인가
9. AI를 이용한 코드 생성이란 무엇인가
10. AI를 이용한 코드 리뷰란 무엇인가
11. AI를 이용한 테스트 생성이란 무엇인가
12. AI 생성 코드는 왜 검증해야 하는가
13. AI 생성 코드에는 어떤 보안 위험이 있는가
14. AI와 기술 부채는 어떤 관계인가
15. AI가 작성한 코드의 책임은 누구에게 있는가
16. Agentic Software Engineering이란 무엇인가
17. Software Development Harness란 무엇인가

---

## 18영역. 다른 AI 분야로 넓혀가기

LLM 중심의 흐름을 이해한 뒤 넓혀가는 구간.

### 입구
1. AI의 주요 분야에는 무엇이 있는가

### 언어와 시각
2. Natural Language Processing이란 무엇인가
3. Computer Vision이란 무엇인가
4. Image Classification이란 무엇인가
5. Object Detection이란 무엇인가
6. Image Segmentation이란 무엇인가
7. Vision-language Model이란 무엇인가

### 만들어내기
8. Text-to-image Generation이란 무엇인가
9. Image Editing과 Inpainting이란 무엇인가
10. Text-to-video Generation이란 무엇인가
11. Video Understanding이란 무엇인가

### 소리
12. Speech Recognition이란 무엇인가
13. Speech Synthesis란 무엇인가
14. Speech-to-speech Model이란 무엇인가
15. Voice Cloning이란 무엇인가
16. Audio Generation이란 무엇인가

### 데이터에서 예측하기
17. 추천 시스템이란 무엇인가
18. 시계열 예측이란 무엇인가
19. 이상 탐지란 무엇인가
20. Graph Neural Network란 무엇인가

### 물리 세계
21. Spatial Intelligence란 무엇인가
22. Embodied AI란 무엇인가
23. Robotics에서 Perception·Planning·Control은 무엇인가
24. Vision-Language-Action Model이란 무엇인가
25. World Model이란 무엇인가

### 작고 가깝게
26. On-device AI란 무엇인가
27. Small Language Model이란 무엇인가

### 과학
28. 과학 연구에서 AI는 어떻게 쓰이는가

---

## 19영역. Responsible AI와 사회적 개념 이해하기

만든 것에 책임을 지는 일.

### 무엇을 책임지는가
1. Responsible AI란 무엇인가
2. Trustworthy AI란 무엇인가
3. AI Governance란 무엇인가
4. AI Risk Management란 무엇인가

### 공정함
5. Algorithmic Bias란 무엇인가
6. Fairness란 무엇인가

### 설명할 수 있는가
7. Explainability와 Interpretability는 무엇이 다른가
8. Transparency와 Disclosure란 무엇인가
9. Accountability란 무엇인가

### 데이터의 권리
10. Privacy와 Data Protection이란 무엇인가
11. Data Governance란 무엇인가
12. Data Provenance란 무엇인가

### 만든 것을 밝히기
13. Model Card와 System Card란 무엇인가
14. Content Provenance란 무엇인가
15. AI 생성물 표시와 Watermarking이란 무엇인가

### 법과 제도
16. AI 저작권의 핵심 쟁점은 무엇인가
17. AI 라이선스란 무엇인가
18. 고위험 AI 시스템이란 무엇인가
19. AI Impact Assessment란 무엇인가
20. AI Incident Disclosure란 무엇인가

### 더 큰 문제
21. AI Literacy란 무엇인가
22. Frontier AI와 Systemic Risk란 무엇인가
23. AI는 환경에 어떤 영향을 주는가

---

# 4부. v4에서 보강한 것

이전 목록에서 빠져 있던 개념들. 왜 넣었는지 함께 적는다.

**1영역** — `인공지능은 어떻게 발전해왔는가`. 지금 방식이 왜 이렇게 굳었는지 설명하는 맥락이 없었다.

**2영역** — 데이터 준비 단계가 통째로 비어 있었다. 라벨링, 전처리, 증강, 클래스 불균형, 데이터 품질. 그리고 `머신러닝 워크플로우`, `선형·로지스틱 회귀`, `차원의 저주`, `Hyperparameter Tuning`, `혼동행렬과 정밀도·재현율`, `Batch/Online Learning`, `Active Learning`. 학습의 재료와 평가 지표가 빠져 있었다.

**3영역** — `Encoder와 Decoder`, `Multi-Head Attention`, `Attention의 계산 비용과 효율화`, `State Space Model`. 구조를 설명하는 데 필요한 부품과, Transformer 이후의 대안 계열.

**4영역** — `Consistency Model`, `Diffusion Transformer`, `Classifier-free Guidance`. 최근 이미지·영상 생성의 실제 구성 요소.

**5영역** — `Reward Model`, `RLAIF와 Constitutional AI`, `검증 가능한 보상 기반 강화학습`, `Process/Outcome Reward Model`, `Model Merging`, `Self-Consistency`, `Speculative Decoding`. 특히 추론 모델을 만드는 최근 방식이 전부 빠져 있었다.

**6영역** — `Meta Prompting과 프롬프트 자동 최적화`.

**8영역** — `Webhook과 비동기 처리`.

**9영역** — `Contextual Retrieval`, `Agentic RAG`. 검색 정확도를 높이는 최근 방식과, 에이전트가 스스로 검색을 반복하는 형태.

**11영역** — `Agent Skill`, `Subagent`.

**12영역** — `MCP Sampling`, `MCP Elicitation`. 프로토콜의 실제 기능인데 빠져 있었다.

**14영역** — `Backdoor와 Sleeper Agent`, `Alignment Faking`.

**16영역** — `Model Serving`, `추론 최적화와 배칭`. 운영에서 실제로 가장 자주 다루는 부분이 없었다.

**18영역** — `추천 시스템`, `시계열 예측`, `이상 탐지`, `Graph Neural Network`, `과학 연구에서의 AI`. 산업에서 가장 널리 쓰이는 머신러닝 응용이 통째로 빠져 있었다.

---

# 마지막

이 목록은 완성해야 할 커리큘럼이 아니라, 계속 자라는 지도다. 앞의 글을 다 쓴 다음에야 다음으로 넘어가야 하는 것도 아니다.

새 개념이 이름을 얻으면 2부의 절차에 따라 자리를 찾아 넣는다. 매일의 변화는 AI Update가 흡수하고, 쌓인 개념은 Lecture와 Practice로 조립된다.
