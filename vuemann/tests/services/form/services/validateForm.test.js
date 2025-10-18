import { formService } from '@brugmann/vuemann/src/services/form/init/form-service.js';
import { describe, it, expect, beforeEach } from 'vitest';
import {createPinia, setActivePinia} from "pinia";
import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js';

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('validateForm', () => {
  beforeEach(() => setActivePinia(createPinia()) )

  it('devrait valider un formulaire sans erreurs', () => {
    const rules = { 
        username: { rules: 'required' },
        email: { rules: 'required' },
    };
    const datas = {
      username: 'JohnDoe',
      email: 'john.doe@example.com',
    };

    const result = formService.validateForm(rules, datas);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('devrait retourner une erreur pour un champ manquant', () => {
    const rules = { username: { rules: 'required' }};
    const datas = { username: '' };

    const result = formService.validateForm(rules, datas);

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('username', 'field_required');
  });

  it('devrait executé un custom test', () => {
    const rules = { username: { 
      rules: 'be_admin',

        tests: { 
          be_admin: value => (value === 'admin' ? '' : 'field_required') 
        }
      }
    };

    const datas = { username: 'user' };

    const result = formService.validateForm(rules, datas);

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('username', 'field_required');
  });

  it('devrait retourner une erreur pour un champ manquant custom error', () => {
    const rules = { username: { rules: 'required', errors: { required : 'missing field'} }};
    const datas = { username: '' };

    const result = formService.validateForm(rules, datas);

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('username', 'missing field');
  });

  it('devrait ignorer les champs optionnels non remplis', () => {
    const rules = { bio: { rules: '' }};
    const datas = { bio: ''};

    const result = formService.validateForm(rules, datas);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
  
  it('devrait exécuter des tests globaux', () => {
    const rules = {
      global_tests: [
        datas => (datas.username === 'admin' ? 'Admin is not allowed' : ''),
      ],
      username: { rules: 'required' },
    };
    const datas = { username: 'admin' };

    const result = formService.validateForm(rules, datas);

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('global_tests', 'Admin is not allowed');
  });

  it('dois enregistrer la configuration du formulaire', () => {
    const rules = { username: { rules: 'required' }};
    const datas = { username: 'admin' };
    const options = { foo: 'bar' };

    formService.validateForm(rules, datas, options);
    
    expect(formStore.getOptions()).toEqual(options);

  })

  it("doit modifier le nom des erreurs avec l'option form", () => {
    const rules = { email: { rules: 'required' }};
    const datas = { };

    const result = formService.validateForm(rules, datas, { form: 'test' });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('test.email'); 
    expect(formStore.getErrors()).toHaveProperty('test.email');
  })

  it("doit enregistrer les erreurs de validation s'il n'y a pas d'option store_errors", () => {
    const rules = { username: { rules: 'required' }};
    const datas = { };

    const result = formService.validateForm(rules, datas);
  
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('username', 'field_required');
    expect(formStore.getErrors()).toHaveProperty('username', 'field_required');
  })  
});
