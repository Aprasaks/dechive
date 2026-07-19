'use client';
import { HomeSections } from '@/components/home/HomeSections';
export default function HomeClient({ heroSerifClassName }: { heroSerifClassName: string }) { return <main id="main-content" className="min-h-screen bg-background text-foreground"><HomeSections heroSerifClassName={heroSerifClassName} /></main>; }
