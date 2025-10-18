<template>
  <h1 class="h1">Variables</h1>
  <h2 class="h2">Structure des variables</h2>
  <p>
    Les variables de couleurs et de tailles possèdes une structure identique : <span class="badge-code">${variable_name}-{size}</span>. 
    Le suffixe size précisera la taille souhaitée : <span class="badge-code">100</span> : petit/clair jusqu'à <span class="badge-code">900</span> : grand / foncé.
  </p>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger"></i>
    Exception des couleurs : Les couleurs de base ne porte pas le suffixe <span class="badge-code">-500</span>
    <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
  </p>
  <div class="div-code">
    <span class="color-neutral-600">//n'éxiste pas</span><br />
    $primary-500<br /><br />
    <span class="color-neutral-600">//éxiste</span><br />
    $primary
  </div>
  <h2 class="h2">Liste des variables</h2>
  <div class="div-code">
    $xs: 320px;<br />    $sm: 576px;<br />    $md: 768px;<br />    $lg: 992px;<br />    $xl: 1200px;<br />    $xxl: 1400px;<br />    <br />    $primary-300: 20% plus clair que $primary<br />    $primary-400: 10% plus clair que $primary<br />    $primary: #582C4D;<br />    $primary-600: 10% plus sombre que $primary<br />    <br />    $blue-300: #08baba;<br />    $blue: #2b4570;<br />    <br />    $green-300: #9be190;<br />    $green: #419a78;<br />    <br />    $yellow: #e6d458;<br />    <br />    $red: #D36380;<br />    <br />    $neutral-100: #ffffff;<br />    $neutral-200: #f8f7f5;<br />    $neutral-300: #ededed;<br />    $neutral-400: #d9d9d9;<br />    $neutral-500: #7e7e7e;<br />    $neutral-600: #4f4f51;<br />    $neutral-700: #444446;<br />    $neutral-800: #1f2932;<br />    $neutral-900: #000000;<br />    <br />    $danger-300: #ffe5e8;<br />    $danger: #c93545;<br />    $warning-300: #fbeb99;<br />    $warning: #fdf213;<br />    $success-300: #c8e6c5;<br />    $success: #49cb54;<br />    $info-300: #b6e9ff;<br />    $info: #5da2f6;<br />    <br />    $fs-300: 0.85rem;<br />    $fs-400: 0.9375rem;<br />    $fs-500: 1rem;<br />    $fs-600: 1.2rem;<br />    $fs-700: 1.35rem;<br />    $fs-800: 1.5rem;<br />    <br />    $fs-icon-300: 1.2rem;<br />    $fs-icon-400: 1.4rem;<br />    <br />    $h1-fs: 2rem;<br />    $h2-fs: 1.55rem;<br />    $h3-fs: 1.1rem;<br />    $h4-fs: 1rem;<br />    <br />    $header-height: 100px;<br />  </div>
</template>
