export const EVENT_LABELS = {
  page_view: '페이지를 봄',
  session_start: '방문 세션이 시작됨',
  first_visit: '처음 방문함',
  scroll: '페이지 아래쪽까지 스크롤함',
  click: '링크를 클릭함',
  file_download: '파일을 다운로드함',
  view_search_results: '검색 결과를 봄',
  user_engagement: '일정 시간 이상 머무름',
};

export function getEventLabel(eventName) {
  return EVENT_LABELS[eventName] ?? '사용자 정의 이벤트 또는 GA4 자동 이벤트';
}
