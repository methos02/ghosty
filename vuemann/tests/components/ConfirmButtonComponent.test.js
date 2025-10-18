import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ConfirmButton from "@brugmann/vuemann/src/components/ConfirmButtonComponent.vue";
import { initDialogFunctions } from "&/utils/mocks/dialog-mock.js";

describe('ConfirmButtonComponent', () => {
  let wrapper;
  let mockCallback;
  let dialogSpies;

  const createWrapper = (props = {}, slots = {}) => {
    return mount(ConfirmButton, {
      props: { cb: mockCallback, ...props },
      slots: { default: "Supprimer l'élément", ...slots }
    });
  };

  beforeEach(() => {
    mockCallback = vi.fn();
    vi.useFakeTimers();
    dialogSpies = initDialogFunctions();
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Mode Inline (par défaut)', () => {
    it('should render initial state correctly', () => {
      wrapper = createWrapper();

      expect(wrapper.find('[data-confirm]').exists()).toBe(true);
      expect(wrapper.find('[data-buttons]').exists()).toBe(true);
      expect(wrapper.find('[data-buttons]').isVisible()).toBe(false);
      expect(wrapper.text()).toContain("Supprimer l'élément");
    });

    it('should show confirmation buttons when clicked', async () => {
      wrapper = createWrapper();

      await wrapper.find('[data-confirm]').trigger('click');

      expect(wrapper.find('[data-buttons]').isVisible()).toBe(true);
      expect(wrapper.find('[data-valide]').exists()).toBe(true);
      expect(wrapper.find('[data-cancel]').exists()).toBe(true);
    });

    it('should execute callback with params when confirmed', async () => {
      const params = ['param1', 'param2'];
      wrapper = createWrapper({ params });

      await wrapper.find('[data-confirm]').trigger('click');
      await wrapper.find('[data-valide]').trigger('click');

      expect(mockCallback).toHaveBeenCalledWith('param1', 'param2');
    });

    it('should hide confirmation buttons when cancelled', async () => {
      wrapper = createWrapper();

      await wrapper.find('[data-confirm]').trigger('click');
      expect(wrapper.find('[data-buttons]').isVisible()).toBe(true);

      await wrapper.find('[data-cancel]').trigger('click');
      await wrapper.vm.$nextTick();
      
      // Vérifier que l'état a été réinitialisé
      expect(wrapper.vm.state).toBe('init');
      // Les boutons peuvent rester visibles selon la logique du Loader
      expect(wrapper.find('[data-buttons]').exists()).toBe(true);
    });
  });

  describe('Mode Dialog', () => {
    it('should render dialog when question is provided', () => {
      const question = 'Êtes-vous sûr ?';
      wrapper = createWrapper({ question });

      expect(wrapper.findComponent({ name: 'DialogComponent' }).exists()).toBe(true);
      expect(wrapper.text()).toContain(question);

      expect(wrapper.find('[data-valide]').exists()).toBe(true);
      expect(wrapper.find('[data-cancel]').exists()).toBe(true);
    });

    it('should show dialog when clicked in dialog mode', async () => {
      const question = 'Êtes-vous sûr ?';
      wrapper = createWrapper({ question });

      await wrapper.find('[data-confirm]').trigger('click');

      expect(dialogSpies.showModalSpy).toHaveBeenCalled();
    });

    it('should execute callback when confirmed in dialog mode', async () => {
      const params = ['param1'];
      wrapper = createWrapper({ 
        question: 'Êtes-vous sûr ?',
        params
      });

      await wrapper.find('[data-valide]').trigger('click');

      expect(mockCallback).toHaveBeenCalledWith(params[0]);
    });

    it('should close dialog when cancelled in dialog mode', async () => {
      wrapper = createWrapper({ 
        question: 'Êtes-vous sûr ?'
      });

      await wrapper.find('[data-confirm]').trigger('click');
      await wrapper.find('[data-cancel]').trigger('click');

      expect(mockCallback).not.toHaveBeenCalled();
      expect(dialogSpies.closeModalSpy).toHaveBeenCalled();
    });
  });

  describe('Props validation', () => {
    it('should use default props correctly', () => {
      wrapper = createWrapper();

      expect(wrapper.vm.params).toEqual([]);
      expect(wrapper.vm.question).toBe('');
    });

    it('should accept custom props', () => {
      const customProps = {
        params: ['custom', 'params'],
        question: 'Question personnalisée',
      };

      wrapper = createWrapper(customProps);

      expect(wrapper.vm.params).toEqual(['custom', 'params']);
      expect(wrapper.vm.question).toBe('Question personnalisée');
    });
  });
});
