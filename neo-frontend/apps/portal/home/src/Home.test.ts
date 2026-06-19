import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Home from './Home.vue';

// A dummy RouterLink component that renders a standard anchor tag with its slot content.
// This allows testing the inner text content without requiring the full Vue Router library.
const DummyRouterLink = {
  name: 'RouterLink',
  setup(props: any, { slots }: any) {
    return () => h('a', slots.default ? slots.default() : []);
  }
};

describe('Home.vue', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'Healthy' }),
      })
    ));
  });

  it('renders the header title and span correctly', () => {
    const wrapper = mount(Home, {
      global: {
        components: {
          'router-link': DummyRouterLink
        }
      }
    });

    // Check if the main title is rendered
    expect(wrapper.text()).toContain('歡迎來到');
    expect(wrapper.text()).toContain('Neo Web Portal');

    // Check if span is rendered
    expect(wrapper.text()).toContain('全新系統入口');
  });

  it('renders module link buttons', () => {
    const wrapper = mount(Home, {
      global: {
        components: {
          'router-link': DummyRouterLink
        }
      }
    });

    // Check if introduction link card text exists
    expect(wrapper.text()).toContain('Introduction 介紹模組');

    // Check if privacy link card text exists
    expect(wrapper.text()).toContain('Privacy 隱私條款');
  });
});


