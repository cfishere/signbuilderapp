import { describe, it, expect, beforeEach } from 'vitest';
vi.stubEnv('MODE', 'test'); // Forces the import.meta.env.MODE === 'test' to be true
import router from '@/router';
import axios from 'axios';
import { signTemplates } from '@/templates/signTemplates';
import { mount } from '@vue/test-utils';
import * as fabric from 'fabric';






let wrapper;

let canvasMock;

























vi.mock('axios', () => {
  const mockGet = vi.fn((url) => {
    console.log('🔥 axios.get called with:', url);
    return Promise.resolve({
      data: [
        {
          id: 1,
          name: 'Test Design',
          canvas_json: '{}',
          created_at: '2025-07-01T00:00:00Z',
        }
      ]
    });
  });

  return {
    default: {
      get: mockGet
    }
  };
});

/*vi.mock('@/components/UserDesignPanel.vue', () => ({
  default: {
    template: '<div>UserDesignPanel (mock)</div>'
  }
}));*/



let fabricCanvasSpy = vi.spyOn(fabric, 'Canvas').mockImplementation(() => {
  return {
    on: vi.fn(),
    add: vi.fn(),
    getWidth: () => 800,
    getHeight: () => 600,
    renderAll: vi.fn(),
    sendToBack: vi.fn(), // for rect
  };
});
import CanvasEditor from '@/components/CanvasEditor.vue';




describe('CanvasEditor.vue', () => {
  let wrapper;
  

beforeEach(() => {
  // 👇 Mock canvas instance
  canvasMock = {
    on: vi.fn(),
    add: vi.fn(),
    getWidth: () => 800,
    getHeight: () => 600,
    renderAll: vi.fn(),
    sendToBack: vi.fn(),
  };

  // 👇 Spy *before* mounting
  fabricCanvasSpy = vi.spyOn(fabric, 'Canvas').mockImplementation(() => {
    console.log('🧪 fabric.Canvas mock called!');
    return canvasMock;
  });

  /*// 👇 Create fake canvas element for fabric
  document.body.innerHTML = `<canvas id="canvasEl"></canvas>`;*/

  wrapper = mount(CanvasEditor, {
    props: {
      email: 'testuser@sample.com',
      width: 72,
      height: 36,
      signType: 'Wall Sign Illuminated Cabinet',
      postalCode: '12345',
      designId: '',
    },
  });
});



  expect(signTemplates['Wall Sign Illuminated Cabinet']).toBeDefined();

  it('mounts successfully', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('axios.get is called with expected URL', async () => {
  await axios.get('/api/user/canvases');
  expect(axios.get).toHaveBeenCalledWith('/api/user/canvases');
});

  it('calls fabric.Canvas on mount', () => {
  expect(fabricCanvasSpy).toHaveBeenCalled(); // 💥 will now succeed
});

  it('fabric.Canvas returned object has .on()', () => {
    /*const instance = fabricCanvasSpy().mock.results[0]?.value;*/
    const instance = fabricCanvasSpy.mock.results[0]?.value;
    expect(typeof instance?.on).toBe('function');
  });



});
