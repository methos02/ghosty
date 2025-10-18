import { defaultTests } from '@brugmann/vuemann/src/services/form/src/default-tests-form.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {createPinia, setActivePinia} from "pinia";
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';

describe('defaultTests.execute', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('devrait retourner une erreur pour un champ requis vide', () => {
    const result = defaultTests.execute('required', '', {});
    expect(result).toBe('field_required');
  });

  it('devrait valider une date valide', () => {
    const result = defaultTests.execute('date:yyyy-mm-dd', '2024-12-25', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une date invalide', () => {
    const result = defaultTests.execute('date:yyyy-mm-dd', 'invalid-date', {});
    expect(result).toBe('date_invalid');
  });

  it('devrait valider une date dans le passé', () => {
    const result = defaultTests.execute('datePast:yyyy-mm-dd', '2020-01-01', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une date invalide', () => {
    const result = defaultTests.execute('datePast:yyyy-mm-dd', 'invalid-date', {});
    expect(result).toBe('date_invalid');
  });

  it('devrait retourner une erreur pour une date future', () => {
    const result = defaultTests.execute('datePast:yyyy-mm-dd', '3000-01-01', {});
    expect(result).toBe('date_not_past');
  });

  it('devrait valider un numéro NISS correct', () => {
    const result = defaultTests.execute('niss', '68060100509', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une date de numéro NISS invalide', () => {
    const result = defaultTests.execute('niss', 'INVALID', {});
    expect(result).toBe('niss_date');
  });

  it('devrait retourner une erreur pour une clé numéro NISS invalide', () => {
    const result = defaultTests.execute('niss', '68060100510', {});
    expect(result).toBe('niss_invalid');
  });

  it('devrait valider un numéro BISS correct', () => {
    const result = defaultTests.execute('biss', '68260100552', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour un numéro BISS invalide', () => {
    const result = defaultTests.execute('biss', 'INVALID', {});
    expect(result).toBe('biss_date');
  });
  
  it('devrait retourner une erreur pour une clé numéro NISS invalide', () => {
    const result = defaultTests.execute('biss', '68260100510', {});
    expect(result).toBe('biss_invalid');
  });

  it('devrait valider un entier', () => {
    const result = defaultTests.execute('integer', '123', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une chaîne non entière', () => {
    const result = defaultTests.execute('integer', 'abc', {});
    expect(result).toBe('field_invalid');
  });

  it('devrait retourner une erreur pour un nombre décimal', () => {
    const result = defaultTests.execute('integer', '12.34', {});
    expect(result).toBe('field_invalid');
  });

  it('devrait valider un entier positif', () => {
    const result = defaultTests.execute('positive', '123', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour un entier négatif', () => {
    const result = defaultTests.execute('positive', '-123', {});
    expect(result).toBe('field_invalid');
  });

  it('devrait retourner une erreur pour zéro', () => {
    const result = defaultTests.execute('positive', '0', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une chaîne non numérique', () => {
    const result = defaultTests.execute('positive', 'abc', {});
    expect(result).toBe('field_invalid');
  });

  // Tests pour les nouveaux tests min et max
  it('devrait valider une valeur supérieure ou égale au minimum', () => {
    const result = defaultTests.execute('min:5', '10', {});
    expect(result).toBe('');
  });

  it('devrait valider une valeur égale au minimum', () => {
    const result = defaultTests.execute('min:5', '5', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une valeur inférieure au minimum', () => {
    const result = defaultTests.execute('min:5', '3', {});
    expect(result).toBe('field_min:min=5');
  });

  it('devrait valider une valeur inférieure ou égale au maximum', () => {
    const result = defaultTests.execute('max:10', '5', {});
    expect(result).toBe('');
  });

  it('devrait valider une valeur égale au maximum', () => {
    const result = defaultTests.execute('max:10', '10', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une valeur supérieure au maximum', () => {
    const result = defaultTests.execute('max:10', '15', {});
    expect(result).toBe('field_max:max=10');
  });

  it('devrait valider une taille minimale', () => {
    const result = defaultTests.execute('sizeMin:5', 'hello', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une chaîne plus petite que la taille minimale', () => {
    const result = defaultTests.execute('sizeMin:5', 'hi', {});
    expect(result).toBe('field_size_min:size=5');
  });

  it('devrait valider une taille maximale', () => {
    const result = defaultTests.execute('sizeMax:5', 'hello', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une chaîne plus grande que la taille maximale', () => {
    const result = defaultTests.execute('sizeMax:5', 'hello world', {});
    expect(result).toBe('field_size_max:size=5');
  });

  it('devrait valider une taille exacte', () => {
    const result = defaultTests.execute('size:5', 'hello', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une chaîne qui ne respecte pas la taille exacte', () => {
    const result = defaultTests.execute('size:5', 'hello world', {});
    expect(result).toBe('field_size_equal:size=5');
  });

  it('devrait appeler errorFlash pour un test inconnu', () => {
    const errorMock = flashService.error = vi.fn()
    defaultTests.execute('unknownTest', 'value', {});
    expect(errorMock).toHaveBeenCalledWith('Le test "unknownTest" est inconnu.');
  });

  // Tests pour la fonction 'in'
  it('devrait valider une valeur qui est dans la liste', () => {
    const result = defaultTests.execute('in:rouge,vert,bleu', 'vert', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une valeur qui n\'est pas dans la liste', () => {
    const result = defaultTests.execute('in:rouge,vert,bleu', 'jaune', {});
    expect(result).toBe('field_in:in=rouge,vert,bleu');
  });

  it('devrait valider une valeur avec une seule option', () => {
    const result = defaultTests.execute('in:unique', 'unique', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une valeur avec une seule option invalide', () => {
    const result = defaultTests.execute('in:unique', 'autre', {});
    expect(result).toBe('field_in:in=unique');
  });

  it('devrait valider une valeur vide si elle est dans la liste', () => {
    const result = defaultTests.execute('in:,option1,option2', '', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une valeur vide si elle n\'est pas dans la liste', () => {
    const result = defaultTests.execute('in:option1,option2', '', {});
    expect(result).toBe('field_in:in=option1,option2');
  });

  it('devrait valider des valeurs avec des espaces', () => {
    const result = defaultTests.execute('in:option avec espaces,autre option', 'option avec espaces', {});
    expect(result).toBe('');
  });

  it('devrait respecter la casse des caractères', () => {
    const result = defaultTests.execute('in:Rouge,Vert,Bleu', 'rouge', {});
    expect(result).toBe('field_in:in=Rouge,Vert,Bleu');
  });

  it('devrait valider avec des valeurs numériques', () => {
    const result = defaultTests.execute('in:1,2,3', '2', {});
    expect(result).toBe('');
  });

  it('devrait retourner une erreur pour une valeur numérique invalide', () => {
    const result = defaultTests.execute('in:1,2,3', '4', {});
    expect(result).toBe('field_in:in=1,2,3');
  });
});
