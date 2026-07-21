const ADS_SETTINGS_URL = 'https://www.google.com/settings/ads';
const GOOGLE_PARTNER_DATA_URL = 'https://policies.google.com/technologies/partner-sites';
const ABOUT_ADS_URL = 'https://www.aboutads.info/';

function PolicyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#f6d29b] underline underline-offset-4 transition-colors hover:text-[#f5ead5]"
    >
      {children}
    </a>
  );
}

export default function PrivacyPolicyClient() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#030303] px-6 py-12 text-[#f3eadb]">
      <article className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-[#f5ead5]">
        개인정보처리방침
      </h1>

      <div className="flex flex-col gap-8 text-[#e8dfcd]/76">
        <section>
          <p className="text-sm text-white/42">최종 수정일: 2026년 5월 6일</p>
          <p className="mt-4 leading-relaxed">
            Dechive는 dechive.dev 웹사이트를 운영합니다. 이 개인정보처리방침은 사용자가 Dechive를 이용할 때 어떤 정보가 수집될 수 있는지, 그 정보가 어떻게 사용되는지, Google AdSense 및 Google Analytics 같은 제3자 서비스가 데이터를 어떻게 처리할 수 있는지를 설명합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-[#f5ead5]">수집하는 정보</h2>
          <p className="leading-relaxed">
            Dechive는 이 웹사이트에서 사용하는 제3자 서비스를 통해 일부 정보를 자동으로 수집할 수 있습니다.
          </p>
          <ul className="mt-3 flex flex-col gap-2 pl-5 text-sm leading-relaxed text-[#e8dfcd]/70">
            <li className="list-disc">IP 주소, 브라우저 종류, 방문한 페이지, 이용 시간 등 로그 데이터</li>
            <li className="list-disc">Google AdSense 및 Google Analytics를 통해 수집되는 쿠키, 식별자, 사용 데이터</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-[#f5ead5]">Google AdSense 및 광고</h2>
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
          <h2 className="mb-3 text-xl font-bold text-[#f5ead5]">쿠키</h2>
          <p className="leading-relaxed">
            쿠키는 사용자의 기기에 저장되는 작은 파일입니다. Dechive와 제3자 서비스는 광고 제공, 트래픽 측정, 사이트 이용 분석, 악용 방지, 서비스 개선을 위해 쿠키, 웹 비콘, IP 주소 또는 기타 식별자를 사용할 수 있습니다. 사용자는 브라우저 설정을 통해 쿠키를 거부할 수 있으나, 일부 기능이 정상적으로 동작하지 않을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-[#f5ead5]">Google Analytics</h2>
          <p className="leading-relaxed">
            Dechive는 방문자가 웹사이트를 어떻게 이용하는지 이해하기 위해 Google Analytics를 사용합니다. Google Analytics는 방문 페이지, 대략적인 위치, 기기 정보, 브라우저 정보, 상호작용 데이터 등을 수집할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-[#f5ead5]">제3자 링크</h2>
          <p className="leading-relaxed">
            이 웹사이트에는 제3자 웹사이트로 연결되는 링크가 포함될 수 있습니다. Dechive는 해당 웹사이트의 콘텐츠나 개인정보 처리 방식에 대해 통제권을 가지지 않으며, 방문자는 각 제3자 사이트의 개인정보처리방침을 확인해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-[#f5ead5]">아동의 개인정보</h2>
          <p className="leading-relaxed">
            이 웹사이트는 만 13세 미만 아동을 대상으로 하지 않습니다. Dechive는 고의로 아동의 개인 식별 정보를 수집하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-[#f5ead5]">방침의 변경</h2>
          <p className="leading-relaxed">
            이 개인정보처리방침은 필요에 따라 변경될 수 있습니다. 변경 사항은 이 페이지에 게시되며, 최종 수정일이 함께 갱신됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-[#f5ead5]">문의</h2>
          <p className="leading-relaxed">
            이 개인정보처리방침에 관한 질문은{' '}
            <a href="mailto:heavenis0113@gmail.com" className="text-[#f6d29b] underline underline-offset-4 transition-colors hover:text-[#f5ead5]">
              heavenis0113@gmail.com
            </a>
            으로 연락해 주세요.
          </p>
        </section>
      </div>
      </article>
    </main>
  );
}
