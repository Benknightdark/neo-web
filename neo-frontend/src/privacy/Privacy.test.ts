import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Privacy from './Privacy.vue';

describe('Privacy.vue', () => {
  it('renders the header and last updated date correctly', () => {
    const wrapper = mount(Privacy);

    // Check main title and subtitle
    expect(wrapper.find('h1').text()).toBe('【Vue】隱私政策');
    expect(wrapper.find('.subtitle').text()).toContain('最後更新：2025年4月14日');
  });

  it('renders all policy sections', () => {
    const wrapper = mount(Privacy);

    const sections = wrapper.findAll('.policy-section');
    expect(sections.length).toBe(4);

    const sectionTexts = sections.map((s) => s.find('h2').text());
    expect(sectionTexts).toContain('我們收集哪些資訊');
    expect(sectionTexts).toContain('我們如何使用您的資訊');
    expect(sectionTexts).toContain('資訊安全');
    expect(sectionTexts).toContain('您的選擇和權利');
  });

  it('renders the contact email link in the footer', () => {
    const wrapper = mount(Privacy);

    const emailLink = wrapper.find('.privacy-footer a');
    expect(emailLink.exists()).toBe(true);
    expect(emailLink.attributes('href')).toBe('mailto:privacy@neocompany.com');
    expect(emailLink.text()).toBe('privacy@neocompany.com');
  });
});
