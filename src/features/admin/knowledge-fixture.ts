import type { DechiveDocument } from '@/features/editor-lab/document';

export const knowledgeAdminFixture: DechiveDocument = {
  type: 'doc', schemaVersion: 1, content: [
    { type:'heading',attrs:{level:2,anchorId:'확인할-질문'},content:[{type:'text',text:'확인할 질문'}] },
    { type:'paragraph',content:[{type:'text',text:'AI 답변을 그대로 믿기 전에 어떤 근거를 확인해야 할까요? '},{type:'text',text:'공식 문서',marks:[{type:'link',attrs:{href:'https://example.com/reference'}}]},{type:'text',text:'를 먼저 확인합니다.'}] },
    { type:'heading',attrs:{level:3,anchorId:'검증-순서'},content:[{type:'text',text:'검증 순서'}] },
    { type:'blockquote',content:[{type:'paragraph',content:[{type:'text',text:'좋은 기록은 답보다 확인 경로를 함께 남깁니다.'}]}] },
    { type:'codeBlock',attrs:{language:'ts'},content:[{type:'text',text:"const verified = sources.every(Boolean);"}] },
    { type:'table',content:[
      {type:'tableRow',content:[{type:'tableHeader',content:[{type:'paragraph',content:[{type:'text',text:'항목'}]}]},{type:'tableHeader',content:[{type:'paragraph',content:[{type:'text',text:'확인'}]}]}]},
      {type:'tableRow',content:[{type:'tableCell',content:[{type:'paragraph',content:[{type:'text',text:'공식 출처'}]}]},{type:'tableCell',content:[{type:'paragraph',content:[{type:'text',text:'필수'}]}]}]},
    ]},
    { type:'figure',attrs:{mediaId:null,src:'/images/thumb.webp',legacySrc:null,media:null,alt:'Dechive 지식 테스트 대표 이미지',caption:'저장과 복원 검증용 이미지',alignment:'center',width:100,sourceReferenceId:null},content:[{type:'caption',content:[{type:'text',text:'저장과 복원 검증용 이미지'}]}] },
    { type:'sourceReference',attrs:{sourceId:'fixture-source-001',locator:'테스트 섹션',note:'관리자 수직 흐름 검증용 출처',label:'테스트 출처'} },
    { type:'callout',attrs:{kind:'checkpoint',tone:null,title:'검증 체크포인트'},content:[{type:'paragraph',content:[{type:'text',text:'제목, 링크, 표, 이미지와 출처가 다시 열었을 때 보존되는지 확인합니다.'}]}] },
  ],
};
