<script setup>
import InputSearch from "@brugmann/vuemann/src/services/form/views/inputs/InputSearchComponent.vue";
import Paginator from "@brugmann/vuemann/src/components/PaginatorComponent.vue";
import { ref, watch } from "vue";
import { t } from "@brugmann/vuemann/src/services/services-helper.js";
import { UserController } from "@brugmann/vuemann/src/apis/users/controllers/user-controller.js";
import ErrorForm from "@brugmann/vuemann/src/services/form/views/ErrorFormComponent.vue";

const props = defineProps({
  modelValue: { type: Object, required: true },
  groups: { type: Boolean, default: false },
  count: { type: Number, default: undefined },
  callback: { type: Function, default: undefined }
})

const search = ref('')
const users = ref([])
const inputSearch = ref()

watch(() => users.value, users => {
  inputSearch.value.toggleDropdown(users.length > 0)
})

watch(() => search.value, search => {
  if(search.length === 0) { users.value = [] }
})

const typeSearch = ref('fullname')
const switchSearch = async () => {
  typeSearch.value = typeSearch.value === 'username' ? 'fullname' : 'username'
  search.value = ''
  users.value = []
  usersPaginator.value = { skip: 0, limit: 20 }
  inputSearch.value.focus()
}

const usersPaginator = ref({ skip: 0, limit: 20 })
const userSearch = async (searchTerm, skip = usersPaginator.value.skip, limit = usersPaginator.value.limit) => {
  const options = { skip, limit, groups: props.groups, typeSearch: typeSearch.value }
  
  const response = props.callback 
    ? await props.callback(searchTerm, options)
    : await UserController.userSearch(searchTerm, options);
  
  if(response === null) { return [] }

  if(skip === 0) { users.value = [] }

  users.value.push(...response.users)
  if(response.paginator?.skip !== undefined) { usersPaginator.value = response.paginator }

  return response.users
}

const loadMoreUser = async (skip, limit) => {
  if(search.value.length === 0) { return }
  await userSearch(search.value, skip + limit, limit)
}

const toggleDropdown = state => { inputSearch.value.toggleDropdown(state) }
const setSearch = state => { inputSearch.value.setSearch(state) }

defineExpose({ toggleDropdown, setSearch })

const emit = defineEmits(['update:modelValue']);
watch(users, users => { emit('update:modelValue', users) })
</script>

<template>
  <div class="user-search-container">
    <div class="form-group">
      <button
        id="user_search_switch"
        type="button"
        class="btn btn-primary"
        @click="switchSearch"
        :title="t('user_search.switch_search_title')"
      >
        <i class="fa-solid fa-repeat"></i>
      </button>
      <InputSearch
        ref="inputSearch"
        name="user_search"
        class="user-search-input"
        :cb="userSearch"
        :pattern="/^[a-zA-Z\s]+$/"
        :label="t(`user_search.search_${typeSearch}_label`)"
        :displayError="false"
        v-model="search"
      >
        <Paginator
          data-users 
          type="infinite" 
          :params="usersPaginator" 
          :cb="loadMoreUser"
        >
          <p 
            data-total 
            class="result-total | ml-10 fw-700 color-primary-300"
          >
            {{ t('user_search.users_found', { count: usersPaginator.total }) }}
          </p>
          <ul 
            class="users-list | f-column g-5 my-5" 
          >    
            <slot></slot>
          </ul>
        </Paginator>
      </InputSearch>
    </div>
    <ErrorForm name="user_search" />
  </div>
</template>
<style lang="scss">
.user-search-input {
  width: 250px;
}
.users-list {
    max-height: 150px;
}
</style>
