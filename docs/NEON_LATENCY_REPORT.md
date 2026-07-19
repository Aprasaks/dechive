# Neon Latency Report

- **Status:** Local macOS to Neon Singapore measured; Vercel sin1 blocked
- **Last Updated:** 2026-07-18
- **Authority:** Singapore staging latency 측정 결과
- **Purpose:** 실행 환경이 다른 latency를 섞지 않고 기록한다.

Neon Singapore staging을 로컬 macOS에서 측정했다. Vercel staging deployment가 없어 `sin1` 수치는 측정하지 않았고 통과로 표시하지 않는다. 아래는 개발 환경 관찰값이며 SLA가 아니다.

| 항목 | n | median | p95 | min–max |
|---|---:|---:|---:|---:|
| direct cold + SELECT 1 | 5 | 557.15 ms | 578.37 ms | 546.21–578.37 ms |
| pooled cold + SELECT 1 | 5 | 545.23 ms | 548.18 ms | 540.45–548.18 ms |
| pooled warm SELECT 1 | 20 | 77.01 ms | 77.66 ms | 75.78–77.73 ms |
| route lookup | 20 | 77.08 ms | 77.46 ms | 76.34–77.73 ms |
| Knowledge detail | 20 | 77.36 ms | 78.13 ms | 76.22–78.52 ms |
| Digest query | 20 | 77.22 ms | 78.01 ms | 76.49–79.90 ms |
| short read-only transaction | 20 | 230.69 ms | 232.57 ms | 229.12–235.40 ms |

Controlled publish latency는 staging에 published write를 남기지 않기 위해 실행하지 않았다. Vercel staging이 준비되면 동일 series를 `sin1`에서 별도로 측정한다.
