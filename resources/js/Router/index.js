import { createRouter, createWebHistory } from 'vue-router';
import { usePage } from '@inertiajs/vue3';
import DesignerSetup from '@/Components/DesignerSetup.vue';
import CanvasEditor from '@/Components/CanvasEditor.vue';

const routes = [
  {
    path: '/canvas',
    name: 'canvas',
    component: () => import('@/Pages/Canvas.vue'),
    props: route => ({    
      /*email: route.query.email || null, 
      width: Number(route.query.width),
      height: Number(route.query.height),
      signType: route.query.signType,
      postalCode: route.query.postalCode,
      designId: route.query.designId || null,*/
    }),

  /*  beforeEnter: (to, from, next) => {
      const { email, width, height, signType, postalCode, designId } = to.query;
      const user = window?.__INITIAL_PAGE__?.props?.auth?.user;
      const hasProps =
        width && height && signType && postalCode &&
        !isNaN(Number(width)) &&
        !isNaN(Number(height)) &&
        typeof signType === 'string' &&
        typeof postalCode === 'string';
      const canProceed = user || designId || hasProps;
      if (canProceed) {
        next();
      } else {       
        next({ name: 'getstarted' });
      }
    }*/
  },
  {
    path: '/',
    name: 'getstarted',
    component: () => import('@/Pages/GetStarted.vue'),
    props: route => ({     
    }),  
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;


