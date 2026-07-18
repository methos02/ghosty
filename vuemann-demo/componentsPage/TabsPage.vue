<script setup>
import { ref } from 'vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import TabsComponent from '@brugmann/vuemann/src/components/tabs/TabsComponent.vue'
import TabItem from '@brugmann/vuemann/src/components/tabs/TabItemComponent.vue'

const activeTab = ref('general')
const activeTabWithIcons = ref('profile')
</script>

<template>
  <h1 class="h1">Component Tabs</h1>
  <p class="my-10">
    Composant d'onglets réutilisable avec support v-model, icônes et accessibilité.
  </p>

  <h2 class="h2">Composants</h2>
  <ul>
    <li><span class="badge-code">TabsComponent</span> - Conteneur principal des onglets</li>
    <li><span class="badge-code">TabItem</span> - Élément d'onglet individuel</li>
  </ul>

  <h2 class="h2">Propriétés TabsComponent</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Requis</th>
        <th>Défaut</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>modelValue</td>
        <td>String</td>
        <td>-</td>
        <td>''</td>
        <td>Clé de l'onglet actif (support v-model)</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Propriétés TabItem</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Requis</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>tabKey</td>
        <td>String</td>
        <td>Oui</td>
        <td>Identifiant unique de l'onglet</td>
      </tr>
      <tr>
        <td>label</td>
        <td>String</td>
        <td>Oui</td>
        <td>Texte affiché sur l'onglet</td>
      </tr>
      <tr>
        <td>icon</td>
        <td>String</td>
        <td>-</td>
        <td>Classe d'icône FontAwesome (optionnel)</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Événements émis</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Événement</th>
        <th>Payload</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>update:modelValue</td>
        <td>String</td>
        <td>Émis lors du changement d'onglet avec la nouvelle clé</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Binding v-model</h3>
  <p>Le composant supporte v-model pour la synchronisation bidirectionnelle de l'onglet actif.</p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Déclaration simplifiée</h3>
  <p>
    Chaque onglet est défini avec <span class="badge-code">TabItem</span> - label, icône et contenu
    au même endroit.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Support des icônes</h3>
  <p>
    Ajoutez une propriété <span class="badge-code">icon</span> avec une classe FontAwesome pour
    afficher une icône.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Fallback modelValue invalide</h3>
  <p>
    Si la valeur de modelValue ne correspond à aucun onglet, le premier onglet est automatiquement
    sélectionné.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Accessibilité</h3>
  <ul>
    <li><span class="badge-code">role="tablist"</span> sur le conteneur des boutons</li>
    <li><span class="badge-code">role="tab"</span> sur chaque bouton d'onglet</li>
    <li><span class="badge-code">aria-selected</span> indique l'onglet actif</li>
    <li><span class="badge-code">role="tabpanel"</span> sur le conteneur du contenu</li>
  </ul>

  <h2 class="h2">Exemple - Onglets basiques</h2>
  <TabsComponent v-model="activeTab">
    <TabItem
      tabKey="general"
      label="Général"
    >
      <h3 class="h3">Paramètres généraux</h3>
      <p>Configurez vos préférences générales ici.</p>
    </TabItem>

    <TabItem
      tabKey="security"
      label="Sécurité"
    >
      <h3 class="h3">Paramètres de sécurité</h3>
      <p>Gérez vos paramètres de sécurité et mots de passe.</p>
    </TabItem>

    <TabItem
      tabKey="notifications"
      label="Notifications"
    >
      <h3 class="h3">Paramètres de notifications</h3>
      <p>Contrôlez comment vous recevez les notifications.</p>
    </TabItem>
  </TabsComponent>

  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      import TabsComponent from '@brugmann/vuemann/src/components/tabs/TabsComponent.vue' \n import
      TabItem from '@brugmann/vuemann/src/components/tabs/TabItemComponent.vue' \n \n const
      activeTab = ref('general')
    </scriptBalise>
    <template v-pre>
      <TabsComponent v-model="activeTab">
        <TabItem
          tabKey="general"
          label="Général"
        >
          <h3 class="h3">Paramètres généraux</h3>
          <p>Configurez vos préférences générales ici.</p>
        </TabItem>

        <TabItem
          tabKey="security"
          label="Sécurité"
        >
          <h3 class="h3">Paramètres de sécurité</h3>
          <p>Gérez vos paramètres de sécurité et mots de passe.</p>
        </TabItem>

        <TabItem
          tabKey="notifications"
          label="Notifications"
        >
          <h3 class="h3">Paramètres de notifications</h3>
          <p>Contrôlez comment vous recevez les notifications.</p>
        </TabItem>
      </TabsComponent>
    </template>
  </CodeHtml>

  <h2 class="h2">Exemple - Onglets avec icônes</h2>
  <TabsComponent v-model="activeTabWithIcons">
    <TabItem
      tabKey="profile"
      label="Profil"
      icon="fa-solid fa-user"
    >
      <h3 class="h3">Profil</h3>
      <p>Consultez et modifiez vos informations de profil.</p>
    </TabItem>

    <TabItem
      tabKey="settings"
      label="Paramètres"
      icon="fa-solid fa-gear"
    >
      <h3 class="h3">Paramètres</h3>
      <p>Personnalisez les paramètres de l'application.</p>
    </TabItem>

    <TabItem
      tabKey="messages"
      label="Messages"
      icon="fa-solid fa-envelope"
    >
      <h3 class="h3">Messages</h3>
      <p>Lisez et envoyez des messages aux autres utilisateurs.</p>
    </TabItem>
  </TabsComponent>

  <CodeHtml class="my-15">
    <scriptBalise v-pre> const activeTab = ref('profile') </scriptBalise>
    <template v-pre>
      <TabsComponent v-model="activeTab">
        <TabItem
          tabKey="profile"
          label="Profil"
          icon="fa-solid fa-user"
        >
          <h3 class="h3">Profil</h3>
          <p>Consultez et modifiez vos informations de profil.</p>
        </TabItem>

        <TabItem
          tabKey="settings"
          label="Paramètres"
          icon="fa-solid fa-gear"
        >
          <h3 class="h3">Paramètres</h3>
          <p>Personnalisez les paramètres de l'application.</p>
        </TabItem>

        <TabItem
          tabKey="messages"
          label="Messages"
          icon="fa-solid fa-envelope"
        >
          <h3 class="h3">Messages</h3>
          <p>Lisez et envoyez des messages aux autres utilisateurs.</p>
        </TabItem>
      </TabsComponent>
    </template>
  </CodeHtml>

  <h2 class="h2">Exemple - Onglets dynamiques</h2>
  <p>Vous pouvez aussi générer les onglets à partir d'un tableau :</p>
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      const tabs = [ \n { key: 'tab1', label: 'Onglet 1', content: 'Contenu 1' }, \n { key: 'tab2',
      label: 'Onglet 2', content: 'Contenu 2' } \n ]
    </scriptBalise>
    <template v-pre>
      <TabsComponent v-model="activeTab">
        <TabItem
          v-for="tab in tabs"
          :key="tab.key"
          :tabKey="tab.key"
          :label="tab.label"
        >
          {{ tab.content }}
        </TabItem>
      </TabsComponent>
    </template>
  </CodeHtml>
</template>
