/**
 * Logs 포스트 초안 자동 생성 스크립트
 * 실행: npm run log
 *
 * - 마지막 커밋의 변경사항(git diff)을 읽어
 * - Gemini API로 Logs 포스트 초안을 생성
 * - content/logs/{날짜}-{slug}.md 로 저장 (status: draft)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '');
const LOGS_DIR = path.join(process.cwd(), 'content', 'logs');

function getGitContext(): { diff: string; commitMsg: string } {
  try {
    const commitMsg = execSync('git log -1 --format="%s"', { encoding: 'utf-8' }).trim();
    const diff = execSync('git diff HEAD~1 HEAD -- "*.ts" "*.tsx" "*.js" "*.jsx" "*.css" "*.md"', {
      encoding: 'utf-8',
    }).slice(0, 6000); // 너무 길면 잘라냄
    return { diff, commitMsg };
  } catch {
    // 커밋이 하나뿐일 때 fallback
    const commitMsg = execSync('git log -1 --format="%s"', { encoding: 'utf-8' }).trim();
    const diff = execSync('git diff HEAD -- "*.ts" "*.tsx"', { encoding: 'utf-8' }).slice(0, 6000);
    return { diff, commitMsg };
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

async function generateLog(diff: string, commitMsg: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

  const prompt = `
너는 개발 블로그 Dechive의 Logs 포스트 초안을 작성하는 역할이야.
아래는 최근 git 커밋 메시지와 코드 변경사항(diff)이야.

커밋 메시지: ${commitMsg}

코드 변경사항:
${diff}

위 내용을 바탕으로 Logs 포스트 초안을 아래 형식으로 작성해줘.

규칙:
- 제목은 실제로 구글에서 검색할 법한 에러 메시지나 증상 그대로 + 해결/원인/정리
- summary는 50자 이내 한 줄
- description은 120~160자, 어떤 상황 → 뭐가 문제 → 이 글에서 뭘 알 수 있는지
- 본문은 "상황 → 원인 → 해결 → 결론" 4단 구조
- 날것의 현장 기록 느낌, 공식문서 스타일 절대 금지
- 한국어로 작성
- 본문에 오라버니(작성자) 목소리가 들어갈 자리를 [오라버니 감상 추가] 로 표시해줘

반드시 아래 frontmatter + 본문 형식만 출력해. 다른 말 하지 마:

---
title: "제목"
date: ${new Date().toISOString().split('T')[0]}
tags:
  - 태그1
  - 태그2
slug: slug-here
summary: 한 줄 요약
description: SEO용 설명 120~160자
status: draft
---

## 상황

(어떤 상황이었는지)

[오라버니 감상 추가]

## 원인

(왜 이 문제가 생겼는지)

## 해결

(어떻게 해결했는지, 코드 스니펫 포함)

## 결론

(한 줄 요약 + 다음에 기억할 것)
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function main() {
  console.log('🔍 마지막 커밋 변경사항 읽는 중...');
  const { diff, commitMsg } = getGitContext();

  if (!diff.trim()) {
    console.log('⚠️  변경사항이 없습니다. 커밋 후 다시 실행해주세요.');
    process.exit(0);
  }

  console.log(`📝 커밋: ${commitMsg}`);
  console.log('✨ Gemini로 Logs 초안 생성 중...');

  const content = await generateLog(diff, commitMsg);

  // slug 추출
  const slugMatch = content.match(/slug:\s*(.+)/);
  const slug = slugMatch ? slugify(slugMatch[1].trim().replace(/"/g, '')) : 'log';
  const date = new Date().toISOString().split('T')[0];
  const filename = `${date}-${slug}.md`;

  // content/logs/ 디렉토리 생성
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }

  const filePath = path.join(LOGS_DIR, filename);
  fs.writeFileSync(filePath, content, 'utf-8');

  console.log(`\n✅ 초안 저장 완료: content/logs/${filename}`);
  console.log('👉 파일 열어서 [오라버니 감상 추가] 부분에 한두 줄 추가하고');
  console.log('   status: draft → status: published 로 바꾸면 배포돼요!');
}

main().catch(console.error);
