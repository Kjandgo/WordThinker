import DefaultLayout from '@/layouts/DefaultLayout.vue'

export const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', redirect: { name: 'vocabulary' } },
      {
        path: 'vocabulary',
        name: 'vocabulary',
        component: () => import('@/pages/VocabularyPage.vue'),
        meta: { title: '단어장' },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/pages/NotFoundPage.vue'),
        meta: { title: '페이지를 찾을 수 없습니다' },
      },
    ],
  },
]
