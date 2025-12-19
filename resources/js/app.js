import '../css/app.css';
import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import router from '@/Router'; // Router/index.js
import { ZiggyVue } from '../../vendor/tightenco/ziggy';

createInertiaApp({
  resolve: name =>
    resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue', { eager: true })),

  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(router)
      .use(ZiggyVue)
      .mount(el);
  },
});

// Coerce invalid 'alphabetical' to 'alphabetic' globally
(function fixTextBaseline() {
  try {
    const proto = CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
    if (!proto) return;
    const desc = Object.getOwnPropertyDescriptor(proto, 'textBaseline');
    if (desc && desc.set && desc.get) {
      const origSet = desc.set;
      Object.defineProperty(proto, 'textBaseline', {
        configurable: true,
        enumerable: desc.enumerable,
        get: desc.get,
        set(v) { if (v === 'alphabetical') v = 'alphabetic'; origSet.call(this, v); }
      });
    }
  } catch (_) { /* noop */ }
})();
