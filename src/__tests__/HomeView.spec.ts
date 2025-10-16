import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import HomeView from '../views/HomeView.vue'

describe('HomeView', () => {
  it('mounts without error', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia()],
        mocks: {
          $router: { push: vi.fn() },
        },
        stubs: ['router-link', 'router-view']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})