import { compileLocales } from './src/services/locale/src/locale-vite.js'

/**
 * Le catalogue de traductions vit dans `public/`, qui est ignore par Git : une copie
 * fraiche du depot n'en a aucun, et un catalogue existant ne connait pas les cles
 * ajoutees depuis. Les tests comparant les libelles en clair, ils echouaient alors sur
 * la cle brute. Le plugin Vite ne s'execute qu'au demarrage du serveur ou au build ;
 * on rejoue donc la meme compilation avant la suite.
 */
export default function setup() {
  compileLocales(import.meta.dirname)
}
