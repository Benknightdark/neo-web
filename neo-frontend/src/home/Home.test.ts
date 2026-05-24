import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Home from './Home.vue';

describe('Home.vue', () => {
  it('renders the custom button and normal Tailwind button correctly', () => {
    const wrapper = mount(Home);

    // Check if the title is rendered
    expect(wrapper.text()).toContain('測試自訂 Tailwind 類');

    // Check if custom button exists
    const customBtn = wrapper.find('.custom-btn');
    expect(customBtn.exists()).toBe(true);
    expect(customBtn.text()).toBe('自訂按鈕樣式');

    // Check if inner text exists
    expect(wrapper.text()).toContain(
      '如果您能看到這個藍色背景的方塊，說明 Tailwind CSS 已正確加載！'
    );
  });

  it('toggles shadow classes when mouse enters and leaves the card', async () => {
    const wrapper = mount(Home);

    // Find the hoverable card div (the one with trigger events)
    const hoverCard = wrapper.find('.cursor-pointer');
    expect(hoverCard.exists()).toBe(true);

    // Initially, it should NOT have the hover styling classes
    expect(hoverCard.classes()).not.toContain('shadow-xl');
    expect(hoverCard.classes()).not.toContain('-translate-y-2');

    // Simulate mouseenter
    await hoverCard.trigger('mouseenter');

    // Now it SHOULD have the hover styling classes
    expect(hoverCard.classes()).toContain('shadow-xl');
    expect(hoverCard.classes()).toContain('-translate-y-2');

    // Simulate mouseleave
    await hoverCard.trigger('mouseleave');

    // It should NOT have the hover styling classes again
    expect(hoverCard.classes()).not.toContain('shadow-xl');
    expect(hoverCard.classes()).not.toContain('-translate-y-2');
  });
});
