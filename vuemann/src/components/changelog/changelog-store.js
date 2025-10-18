import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const ChangelogStore = defineStore('changelog', () => {
  const selectedFilter = ref('all')
  const availableTypes = ref(new Set(['all']))
  
  const changeFilter = (filterKey) => {
    selectedFilter.value = filterKey
  }
  
  const registerItemType = (type) => {
    availableTypes.value.add(type)
  }
  
  const isTypeAvailable = (typeKey) => {
    if (typeKey === 'all') { return true }
    return availableTypes.value.has(typeKey)
  }
  
  const getSelectedFilter = computed(() => selectedFilter.value)
  
  return { 
    selectedFilter,
    changeFilter,
    registerItemType,
    isTypeAvailable,
    getSelectedFilter
  }
})

export default ChangelogStore
