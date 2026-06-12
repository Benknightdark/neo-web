import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Home from './Home.vue';

describe('Home.vue', () => {
  it('renders the header title and span correctly', () => {
    const wrapper = mount(Home);

    // Check if the main title is rendered
    expect(wrapper.text()).toContain('歡迎來到');
    expect(wrapper.text()).toContain('Neo Web Portal');

    // Check if span is rendered
    expect(wrapper.text()).toContain('全新系統入口');
  });

  it('renders module link buttons', () => {
    const wrapper = mount(Home);

    // Check if introduction link card text exists
    expect(wrapper.text()).toContain('Introduction 介紹模組');
    
    // Check if privacy link card text exists
    expect(wrapper.text()).toContain('Privacy 隱私條款');
  });
});
