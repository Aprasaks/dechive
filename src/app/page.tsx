import type { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import HomeClient from '@/components/home/HomeClient';
const serif=Noto_Serif_KR({weight:['500'],subsets:['latin'],variable:'--font-home-serif-kr',preload:false});
export const metadata:Metadata={title:'Dechive — 공부하고, 검증하고, 다시 설명하는 AI',description:'사람이 직접 이해한 내용을 지식, 강의, 실습과 AI 변화 기록으로 다시 구성하는 Dechive.',alternates:{canonical:'https://dechive.dev'},openGraph:{title:'Dechive',description:'공부하고, 검증하고, 다시 설명하는 AI',url:'https://dechive.dev',type:'website'}};
export default function Home(){return <HomeClient heroSerifClassName={serif.className}/>}
