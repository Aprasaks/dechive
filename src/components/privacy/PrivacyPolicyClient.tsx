'use client';

import { useLang } from '@/components/layout/LangProvider';

const ADS_SETTINGS_URL = 'https://www.google.com/settings/ads';
const GOOGLE_PARTNER_DATA_URL = 'https://policies.google.com/technologies/partner-sites';
const ABOUT_ADS_URL = 'https://www.aboutads.info/';

function PolicyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-4 hover:text-zinc-100"
    >
      {children}
    </a>
  );
}

export default function PrivacyPolicyClient() {
  const { lang } = useLang();

  if (lang === 'en') {
    return (
      <main className="mx-auto min-h-[calc(100vh-64px-56px)] max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-zinc-100">
          Privacy Policy
        </h1>

        <div className="flex flex-col gap-8 text-zinc-300">
          <section>
            <p className="text-sm text-zinc-500">Last updated: May 6, 2026</p>
            <p className="mt-4 leading-relaxed">
              Dechive operates the website dechive.dev. This Privacy Policy explains what information may be collected, how it is used, and how third-party services such as Google AdSense and Google Analytics may process data when you use this website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-zinc-100">Information We Collect</h2>
            <p className="leading-relaxed">
              Dechive may collect limited information that you provide directly, such as guestbook entries. Third-party services used on this website may also collect certain information automatically.
            </p>
            <ul className="mt-3 flex flex-col gap-2 pl-5 text-sm leading-relaxed text-zinc-400">
              <li className="list-disc">Guestbook name, message, and password hash for guestbook posting.</li>
              <li className="list-disc">Log data such as IP address, browser type, pages visited, and usage time.</li>
              <li className="list-disc">Cookies, identifiers, and usage data collected through Google AdSense and Google Analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-zinc-100">Google AdSense & Advertising</h2>
            <p className="leading-relaxed">
              This website uses Google AdSense to display advertisements. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies enables Google and its partners to serve ads based on visits to this site and/or other sites on the Internet.
            </p>
            <p className="mt-3 leading-relaxed">
              You may opt out of personalized advertising by visiting{' '}
              <PolicyLink href={ADS_SETTINGS_URL}>Google Ads Settings</PolicyLink>. You may also learn more about how Google uses data when you use partner sites or apps at{' '}
              <PolicyLink href={GOOGLE_PARTNER_DATA_URL}>How Google uses information from sites or apps that use our services</PolicyLink>.
            </p>
            <p className="mt-3 leading-relaxed">
              If third-party ad vendors or ad networks serve ads on this website, they may also use cookies for personalized advertising where permitted. You can visit those vendors&apos; websites to opt out if they provide that option, or visit{' '}
              <PolicyLink href={ABOUT_ADS_URL}>aboutads.info</PolicyLink> for additional opt-out choices.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-zinc-100">Cookies</h2>
            <p className="leading-relaxed">
              Cookies are small files stored on your device. Dechive and third-party services may use cookies, web beacons, IP addresses, or other identifiers to provide ads, measure traffic, analyze site usage, prevent abuse, and improve the service. You can configure your browser to refuse cookies, but some features may not work properly.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-zinc-100">Google Analytics</h2>
            <p className="leading-relaxed">
              Dechive uses Google Analytics to understand how visitors use the website. Google Analytics may collect usage data such as visited pages, approximate location, device information, browser information, and interaction data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-zinc-100">Third-Party Links</h2>
            <p className="leading-relaxed">
              This website may contain links to third-party websites. Dechive has no control over those websites and is not responsible for their content or privacy practices. Please review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-zinc-100">Children&apos;s Privacy</h2>
            <p className="leading-relaxed">
              This website is not directed to children under the age of 13. Dechive does not knowingly collect personally identifiable information from children.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-zinc-100">Changes to This Policy</h2>
            <p className="leading-relaxed">
              This Privacy Policy may be updated from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-zinc-100">Contact</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact{' '}
              <a href="mailto:heavenis0113@gmail.com" className="underline underline-offset-4 hover:text-zinc-100">
                heavenis0113@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-64px-56px)] max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-zinc-100">
        개인정보처리방침
      </h1>

      <div className="flex flex-col gap-8 text-zinc-300">
        <section>
          <p className="text-sm text-zinc-500">최종 수정일: 2026년 5월 6일</p>
          <p className="mt-4 leading-relaxed">
            Dechive는 dechive.dev 웹사이트를 운영합니다. 이 개인정보처리방침은 사용자가 Dechive를 이용할 때 어떤 정보가 수집될 수 있는지, 그 정보가 어떻게 사용되는지, Google AdSense 및 Google Analytics 같은 제3자 서비스가 데이터를 어떻게 처리할 수 있는지를 설명합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">수집하는 정보</h2>
          <p className="leading-relaxed">
            Dechive는 방명록 작성처럼 사용자가 직접 제공하는 제한적인 정보를 수집할 수 있습니다. 또한 이 웹사이트에서 사용하는 제3자 서비스가 일부 정보를 자동으로 수집할 수 있습니다.
          </p>
          <ul className="mt-3 flex flex-col gap-2 pl-5 text-sm leading-relaxed text-zinc-400">
            <li className="list-disc">방명록 작성을 위한 이름, 메시지, 비밀번호 해시</li>
            <li className="list-disc">IP 주소, 브라우저 종류, 방문한 페이지, 이용 시간 등 로그 데이터</li>
            <li className="list-disc">Google AdSense 및 Google Analytics를 통해 수집되는 쿠키, 식별자, 사용 데이터</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Google AdSense 및 광고</h2>
          <p className="leading-relaxed">
            Dechive는 광고 표시를 위해 Google AdSense를 사용합니다. Google을 포함한 제3자 공급업체는 사용자의 Dechive 방문 또는 다른 웹사이트 방문 기록을 기반으로 광고를 게재하기 위해 쿠키를 사용할 수 있습니다. Google의 광고 쿠키 사용은 Google 및 Google 파트너가 사용자의 이 사이트 및 인터넷상의 다른 사이트 방문 정보를 바탕으로 광고를 게재할 수 있게 합니다.
          </p>
          <p className="mt-3 leading-relaxed">
            사용자는{' '}
            <PolicyLink href={ADS_SETTINGS_URL}>Google 광고 설정</PolicyLink>
            에서 개인 맞춤 광고를 사용 중지할 수 있습니다. Google이 파트너 사이트 또는 앱을 사용할 때 데이터를 어떻게 사용하는지는{' '}
            <PolicyLink href={GOOGLE_PARTNER_DATA_URL}>Google 서비스 사용 사이트 또는 앱의 정보 사용 방식</PolicyLink>
            에서 확인할 수 있습니다.
          </p>
          <p className="mt-3 leading-relaxed">
            이 웹사이트에서 제3자 광고 공급업체 또는 광고 네트워크가 광고를 게재하는 경우, 해당 업체들도 허용되는 범위에서 개인 맞춤 광고를 위해 쿠키를 사용할 수 있습니다. 사용자는 해당 업체의 웹사이트에서 제공하는 옵트아웃 기능을 이용하거나{' '}
            <PolicyLink href={ABOUT_ADS_URL}>aboutads.info</PolicyLink>
            를 통해 일부 제3자 쿠키 사용을 제한할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">쿠키</h2>
          <p className="leading-relaxed">
            쿠키는 사용자의 기기에 저장되는 작은 파일입니다. Dechive와 제3자 서비스는 광고 제공, 트래픽 측정, 사이트 이용 분석, 악용 방지, 서비스 개선을 위해 쿠키, 웹 비콘, IP 주소 또는 기타 식별자를 사용할 수 있습니다. 사용자는 브라우저 설정을 통해 쿠키를 거부할 수 있으나, 일부 기능이 정상적으로 동작하지 않을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">Google Analytics</h2>
          <p className="leading-relaxed">
            Dechive는 방문자가 웹사이트를 어떻게 이용하는지 이해하기 위해 Google Analytics를 사용합니다. Google Analytics는 방문 페이지, 대략적인 위치, 기기 정보, 브라우저 정보, 상호작용 데이터 등을 수집할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">제3자 링크</h2>
          <p className="leading-relaxed">
            이 웹사이트에는 제3자 웹사이트로 연결되는 링크가 포함될 수 있습니다. Dechive는 해당 웹사이트의 콘텐츠나 개인정보 처리 방식에 대해 통제권을 가지지 않으며, 방문자는 각 제3자 사이트의 개인정보처리방침을 확인해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">아동의 개인정보</h2>
          <p className="leading-relaxed">
            이 웹사이트는 만 13세 미만 아동을 대상으로 하지 않습니다. Dechive는 고의로 아동의 개인 식별 정보를 수집하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">방침의 변경</h2>
          <p className="leading-relaxed">
            이 개인정보처리방침은 필요에 따라 변경될 수 있습니다. 변경 사항은 이 페이지에 게시되며, 최종 수정일이 함께 갱신됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-zinc-100">문의</h2>
          <p className="leading-relaxed">
            이 개인정보처리방침에 관한 질문은{' '}
            <a href="mailto:heavenis0113@gmail.com" className="underline underline-offset-4 hover:text-zinc-100">
              heavenis0113@gmail.com
            </a>
            으로 연락해 주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
