import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/projects';
import ProjectsClient from '@/components/projects/ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects',
  description: '직접 만들고 부수며 배운 것들의 기록. 아이디어가 코드가 되는 과정.',
  alternates: { canonical: 'https://dechive.dev/projects' },
  openGraph: {
    title: 'Projects | Dechive',
    description: '직접 만들고 부수며 배운 것들의 기록. 아이디어가 코드가 되는 과정.',
    url: 'https://dechive.dev/projects',
    images: [{ url: 'https://dechive.dev/images/thumb.webp', width: 1200, height: 630, alt: 'Dechive Projects' }],
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  return <ProjectsClient projects={projects} />;
}
