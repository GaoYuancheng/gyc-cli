import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', redirect: './testPage' },
    { path: '/testPage', component: '@/template/testPage' },
    { path: '/curdPage', component: '@/template/curdPage' },
  ],
  fastRefresh: {},
});
