import {describe, expect, it, vi, beforeEach} from "vitest";
import { mount } from "@vue/test-utils";
import ConfirmIcon from "@brugmann/vuemann/src/components/ConfirmIconComponent.vue";
import { flashService } from "@brugmann/vuemann/src/services/flash/init/flash-service.js";
import { createPinia, setActivePinia } from "pinia";
import { initDialogFunctions } from "../utils/mocks/dialog-mock.js";

describe('ConfirmIconComponent', () => {
  let wrapper;
  let mockCallback;
  let dialogMocks;

  beforeEach(() => {
    setActivePinia(createPinia());
    mockCallback = vi.fn();
    dialogMocks = initDialogFunctions();
    vi.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('affiche correctement avec une icône', () => {
      wrapper = mount(ConfirmIcon, {
        props: { 
          icon: 'fa fa-test', 
          cb: mockCallback 
        }
      });

      expect(wrapper.find('[data-confirm]').exists()).toBe(true);
      expect(wrapper.find('i').classes()).toContain('fa');
      expect(wrapper.find('i').classes()).toContain('fa-test');
      expect(wrapper.find('span').exists()).toBe(false);
    });

    it('affiche correctement avec du texte', () => {
      wrapper = mount(ConfirmIcon, {
        props: { 
          text: 'Supprimer', 
          cb: mockCallback 
        }
      });

      expect(wrapper.find('[data-confirm]').exists()).toBe(true);
      expect(wrapper.find('span').text()).toBe('Supprimer');
      expect(wrapper.find('i').exists()).toBe(false);
    });

    it('affiche une erreur si icône et texte sont fournis ensemble', () => {
      vi.spyOn(flashService, 'error').mockReturnValue(true)
      
      wrapper = mount(ConfirmIcon, {
        props: { 
          icon: 'fa fa-test',
          text: 'Test',
          cb: mockCallback 
        }
      });

      expect(wrapper.find('i').exists()).toBe(false);
      expect(wrapper.find('span').exists()).toBe(false);
      expect(flashService.error).toHaveBeenCalledWith('ConfirmIconComponent: text and icon cannot be used together');
    });
  });

  describe('États du composant', () => {
    beforeEach(() => {
      wrapper = mount(ConfirmIcon, {
        props: { 
          icon: 'fa fa-test', 
          cb: mockCallback 
        }
      });
    });

    it('commence dans l\'état initial', () => {
      expect(wrapper.find('[data-confirm]').exists()).toBe(true);
      expect(wrapper.find('[data-valid]').exists()).toBe(false);
      expect(wrapper.find('[data-cancel]').exists()).toBe(false);
      expect(wrapper.find('.loader-spin').exists()).toBe(false);
    });

    it('passe à l\'état de confirmation au clic', async () => {
      await wrapper.find('[data-confirm]').trigger('click');

      expect(wrapper.find('[data-confirm]').exists()).toBe(false);
      expect(wrapper.find('[data-valid]').exists()).toBe(true);
      expect(wrapper.find('[data-cancel]').exists()).toBe(true);
      expect(wrapper.find('.loader-spin').exists()).toBe(false);
    });

    it('retourne à l\'état initial en cliquant sur annuler', async () => {
      await wrapper.find('[data-confirm]').trigger('click');
      await wrapper.find('[data-cancel]').trigger('click');

      expect(wrapper.find('[data-confirm]').exists()).toBe(true);
      expect(wrapper.find('[data-valid]').exists()).toBe(false);
      expect(wrapper.find('[data-cancel]').exists()).toBe(false);
    });
  });

  describe('Exécution du callback', () => {
    it('exécute le callback sans paramètres', async () => {
      wrapper = mount(ConfirmIcon, {
        props: { 
          icon: 'fa fa-test', 
          cb: mockCallback 
        }
      });

      await wrapper.find('[data-confirm]').trigger('click');
      await wrapper.find('[data-valid]').trigger('click');

      expect(mockCallback).toHaveBeenCalledOnce();
      expect(mockCallback).toHaveBeenCalledWith();
    });

    it('exécute le callback avec des paramètres', async () => {
      const params = ['param1', 'param2'];
      wrapper = mount(ConfirmIcon, {
        props: { 
          icon: 'fa fa-test', 
          cb: mockCallback,
          params 
        }
      });

      await wrapper.find('[data-confirm]').trigger('click');
      await wrapper.find('[data-valid]').trigger('click');

      expect(mockCallback).toHaveBeenCalledOnce();
      expect(mockCallback).toHaveBeenCalledWith('param1', 'param2');
    });

    it('affiche l\'état de chargement pendant l\'exécution du callback', async () => {
      const slowCallback = vi.fn().mockImplementation(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      });

      wrapper = mount(ConfirmIcon, {
        props: { 
          icon: 'fa fa-test', 
          cb: slowCallback 
        }
      });

      await wrapper.find('[data-confirm]').trigger('click');
      const validButton = wrapper.find('[data-valid]');
      
      // Cliquer sur valider mais ne pas attendre
      validButton.trigger('click');
      await wrapper.vm.$nextTick();

      // Vérifier que l'état de chargement est affiché
      expect(wrapper.find('.loader-spin').exists()).toBe(true);
      expect(wrapper.find('[data-valid]').exists()).toBe(false);
      expect(wrapper.find('[data-cancel]').exists()).toBe(false);
    });

    it('retourne à l\'état initial après l\'exécution du callback', async () => {
      wrapper = mount(ConfirmIcon, {
        props: { 
          icon: 'fa fa-test', 
          cb: mockCallback 
        }
      });

      await wrapper.find('[data-confirm]').trigger('click');
      await wrapper.find('[data-valid]').trigger('click');

      // Attendre que le callback soit terminé
      await wrapper.vm.$nextTick();

      expect(wrapper.find('[data-confirm]').exists()).toBe(true);
      expect(wrapper.find('[data-valid]').exists()).toBe(false);
      expect(wrapper.find('[data-cancel]').exists()).toBe(false);
      expect(wrapper.find('.loader-spin').exists()).toBe(false);
    });
  });

  describe('Interface utilisateur', () => {
    beforeEach(() => {
      wrapper = mount(ConfirmIcon, {
        props: { 
          icon: 'fa fa-test', 
          cb: mockCallback 
        }
      });
    });

    it('affiche les bonnes classes CSS pour les boutons de confirmation', async () => {
      await wrapper.find('[data-confirm]').trigger('click');

      const validButton = wrapper.find('[data-valid]');
      const cancelButton = wrapper.find('[data-cancel]');

      expect(validButton.classes()).toContain('confirm-icon_button');
      expect(validButton.classes()).toContain('pointer');
      expect(cancelButton.classes()).toContain('confirm-icon_button');
      expect(cancelButton.classes()).toContain('pointer');
    });

    it('affiche les bonnes icônes pour validation et annulation', async () => {
      await wrapper.find('[data-confirm]').trigger('click');

      const validIcon = wrapper.find('[data-valid] i');
      const cancelIcon = wrapper.find('[data-cancel] i');

      expect(validIcon.classes()).toContain('fa-check');
      expect(validIcon.classes()).toContain('success');
      expect(cancelIcon.classes()).toContain('fa-xmark');
      expect(cancelIcon.classes()).toContain('danger');
    });

    it('applique la classe CSS principale', () => {
      expect(wrapper.find('.confirm-icon').exists()).toBe(true);
      expect(wrapper.find('.f-center').exists()).toBe(true);
    });
  });

  describe('Comportement avec dialog (prop question)', () => {
    beforeEach(() => {
      wrapper = mount(ConfirmIcon, {
        props: { 
          icon: 'fa fa-test', 
          question: 'Êtes-vous sûr de vouloir continuer ?',
          cb: mockCallback 
        }
      });
    });

    it('rendu avec prop question', () => {
      const dialog = wrapper.findComponent({ name: 'DialogComponent' });
      expect(dialog.exists()).toBe(true);
      expect(wrapper.text()).toContain('Êtes-vous sûr de vouloir continuer ?');
    });

    it('affiche les boutons dans le dialog', () => {
      // Les boutons sont dans le template du dialog
      expect(wrapper.find('[data-valide]').exists()).toBe(true);
      expect(wrapper.find('[data-cancel]').exists()).toBe(true);
    });

    it('exécute le callback depuis le dialog', async () => {
      await wrapper.find('[data-valide]').trigger('click');
      expect(mockCallback).toHaveBeenCalledOnce();
    });

    it('change l\'état lors de l\'interaction avec le dialog', async () => {
      expect(wrapper.vm.state).toBe('init');
      
      await wrapper.find('[data-confirm]').trigger('click');
      expect(wrapper.vm.state).toBe('confirm');
    });

    it('garde l\'icône visible après avoir cliqué en mode dialog', async () => {
      expect(wrapper.find('[data-confirm]').exists()).toBe(true);
      expect(wrapper.find('i').exists()).toBe(true);
      
      await wrapper.find('[data-confirm]').trigger('click');
      
      expect(wrapper.find('[data-confirm]').exists()).toBe(true);
      expect(wrapper.find('i').exists()).toBe(true);
      
      expect(wrapper.find('.f-center.g-5').exists()).toBe(false);
    });
  });

  describe('Comportement sans question (boutons directs)', () => {
    beforeEach(() => {
      wrapper = mount(ConfirmIcon, {
        props: { 
          icon: 'fa fa-test', 
          cb: mockCallback 
        }
      });
    });

    it('affiche directement les boutons de confirmation', async () => {
      await wrapper.find('[data-confirm]').trigger('click');

      expect(wrapper.find('[data-valid]').exists()).toBe(true);
      expect(wrapper.find('[data-cancel]').exists()).toBe(true);
    });

    it('n\'affiche pas de dialog', async () => {
      await wrapper.find('[data-confirm]').trigger('click');
      await wrapper.vm.$nextTick();

      const dialog = wrapper.findComponent({ name: 'DialogComponent' });
      expect(dialog.exists()).toBe(false);
    });
  });
});
