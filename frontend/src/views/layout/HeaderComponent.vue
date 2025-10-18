<template>
    <header class="header | d-flex j-between a-center py-5">
        <div class="header-right">
            <router-link to="/" class="d-flex a-center g-5">
                <img 
                    src="@/assets/images/logo-mini.png" 
                    alt="Logo" 
                    class="header-logo"
                >
                <p>
                    <span class="title-left">Ghos</span>
                    <span class="title-right">TY</span>
                </p>
            </router-link>
        </div>
        <div class="header-left | d-flex g-25">
            <button class="btn-auth | btn btn-neutral-100 py-10">
                Connexion
            </button>
            <button class="btn-auth | btn btn-neutral-100 py-10">
                Inscription
            </button>
        </div>
    </header>
</template>

<style lang="scss">
.header {
    padding-inline: 5%;

    &-logo {
        width: 50px;
        height: 50px;
    }

    .title-left {
        font-family: lobsterTwo, sans-serif;
        color: var(--neutral-100);
        font-size: var(--h1-fs);
    }
    
    .title-right {
        font-weight: 700;
        color: var(--primary);
        font-size: var(--h1-fs);
    }

    .btn-auth {
        width: 150px;
    }
}
</style>