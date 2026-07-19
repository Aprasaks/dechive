# Stage 23 Public Lecture Navigation and Preview QA

Stage 23 connects the Stage 22 published-only Lecture renderer to the public information architecture. It does not change Lecture schema, publish transactions, or legacy content routes.

## Public navigation

The shared desktop and mobile navigation order is:

1. Knowledge (`/knowledge`)
2. Lecture (`/lecture`)
3. Deep Dive (`/deep-dive`)
4. AI Updates (`/ai-updates`)
5. Book (`/book`)
6. About (`/about`)

`HomeNavLink` and the mobile menu use the same navigation source. Both mark the active route with `aria-current="page"`; mobile navigation closes after route selection. Archive remains a legacy URL only and is not restored to the primary navigation.

## Homepage and Footer

Homepage entry copy distinguishes the two products: Knowledge records what needs to be understood; Lecture records how that knowledge is explained to another person. The hero and the public entry grid link to `/lecture` without product, enrollment, progress, or course language. Footer uses the same public link order. No unpublished Lecture data is read by Homepage.

## Sitemap

`/sitemap.xml` includes `/lecture` and queries `listPublishedLectures` for only published Lecture detail URLs. Draft and unpublished Lecture rows have no published pointer and are excluded. Existing legacy Archive, Deep Dive, Book, and English URLs remain unchanged.

## Preview QA

The Preview target is used without `--prod`, Production environment changes, or Neon Production access. QA covers the public home-to-Lecture path, header, mobile menu, footer, published detail, primary Knowledge link, draft/not-found 404, `/library` redirect, and legacy routes at 390×844, 768×1024, and 1280×900. The generated Preview URL and deployment evidence are recorded in the Stage 23 completion report rather than source code.

## Next step

Any later work may improve public Lecture presentation only after preserving the published-only service and navigation contract. It must not add membership, payment, enrollment, course/module/lesson hierarchy, or change the existing Knowledge/Archive boundary.
