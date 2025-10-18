<template>
  <h1 class="h1">Display</h1>
  <p>
    Vous pouvez modifier le display d'un élément en utilisant la structure de class <span class="badge-code">.d-{display}</span>.<br />    Display peut prendre les valeurs <span class="fw-700">none</span>, <span class="fw-700">block</span> ou <span class="fw-700">flex</span>
  </p>
  <div class="div-code">
    .d-none => display:"none"<br />    .d-block => display:"block"<br />    .d-flex => display:"flex"<br />  </div>
  <h2 class="h2">Flex</h2>
  <h3 class="h3">Layout helpers</h3>
  <p>
    Les classes suivantes dispence de devoir spécifier la classe d-flex.
  </p>
  <ul class="list ml-25">
    <li><span class="fw-700">f-column</span>: change la direction des enfants d'un élément parent en column.</li>
    <li><span class="fw-700">f-column-reverse</span>: change la direction des enfants d'un élément parent en column-reverse.</li>
    <li><span class="fw-700">f-center</span>: centre les enfants d'un élément parent verticalement et horizontalement.</li>
    <li><span class="fw-700">f-equal</span>: applique la propriété flex:1 à tous les enfants d'un élément parent.</li>
  </ul>
  <p>
    En ajoutant le suffixe <span class="badge-code">-md</span> aux classes f-column et f-column-reverse, le style ne s'appliquera
     qu'a partir de la taille md en ajoutant le suffixe -md ( , ).
  </p>
  <div class="div-code">
    .f-column-md<br />    .f-column-reverse-md<br />  </div>
  <h3 class="h3">Alignements</h3>
  <p>
    La structure suivante <span class="badge-code">.j-{position}</span> et <span class="badge-code">.j-{position}-md</span> permetent de changer le justify-content d'un élément.
  </p>
  <p>
    La structure suivante <span class="badge-code">.a-{position}</span> et <span class="badge-code">.a-{position}-md</span> permetent de changer le align-item d'un élément.
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th>position</th>
        <th>center</th>
        <th>between</th>
        <th>around</th>
        <th>start</th>
        <th>end</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>css</td>
        <th>center</th>
        <th>space-between</th>
        <th>space-around</th>
        <th>flex-start</th>
        <th>flex-end</th>
      </tr>
    </tbody>
  </table>
  <p>
    Vous pouvez rajouter le préfix <span class="badge-code">-md</span> pour que la règle ne s'applique qu'a des écrans suppérieur à 768px.
  </p>
  <h3 class="h3">Classes enfants</h3>
  <p>
    Certaine classes s'applique sur les enfants d'un éléments parents avec un display flex
  </p>
  <div class="div-code">
    f-wrap => flex-wrap: wrap <br />    flex-1 => flex: 1
  </div>
</template>
