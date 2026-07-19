# Public Information Architecture

Practice는 `/practice`와 `/practice/{slug}`에서 published version만 공개한다. 목록은 title, summary, outcome status와 공개 가능한 관련 Knowledge를 표시하며, Draft와 unpublished Practice는 제외한다.

Dechive의 공개 Header는 Knowledge, Lecture, Practice, AI Update, Books만 사용한다. Footer는 Privacy Policy, Terms, Contact, About만 사용한다.

공개 route는 `/`, `/knowledge`, `/lecture`, `/practice`, `/ai-update`, `/books`, `/privacy-policy`, `/terms`, `/contact`, `/about` 및 실제 published Knowledge/Lecture/Practice/AI Update detail이다. AI Update는 공식 발표를 검증해 기록하는 CMS 공개 영역이며 legacy `/ai-updates`와 연결하지 않는다.

회원가입, 로그인 기반 공개 접근, 결제, 유료 콘텐츠, 댓글, 다크모드는 제공하지 않는다. 모든 공개 콘텐츠는 무료다.
