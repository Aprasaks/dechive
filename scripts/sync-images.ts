/**
 * 이미지 동기화 스크립트
 * content/posts/ 의 이미지 파일을 public/images/posts/ 로 복사
 * dev/build 시작 전 자동 실행됨
 */

import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'content', 'posts');
const DEST_DIR = path.join(process.cwd(), 'public', 'images', 'posts');
const IMAGE_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg']);

function syncImages(): void {
  if (!fs.existsSync(SRC_DIR)) {
    console.log('⚠️  content/posts 폴더 없음, 스킵');
    return;
  }

  fs.mkdirSync(DEST_DIR, { recursive: true });

  const files = fs.readdirSync(SRC_DIR);
  let copied = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const src = path.join(SRC_DIR, file);
    const dest = path.join(DEST_DIR, file);

    // 이미 동일한 파일이면 스킵
    if (fs.existsSync(dest)) {
      const srcStat = fs.statSync(src);
      const destStat = fs.statSync(dest);
      if (srcStat.mtimeMs <= destStat.mtimeMs) continue;
    }

    fs.copyFileSync(src, dest);
    copied++;
    console.log(`📷 복사: ${file}`);
  }

  if (copied === 0) {
    console.log('✅ 이미지 동기화 완료 (변경 없음)');
  } else {
    console.log(`✅ 이미지 동기화 완료 (${copied}개 복사)`);
  }
}

syncImages();
