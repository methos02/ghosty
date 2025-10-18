<script setup>
import { ref, computed } from "vue";
import ErrorForm from "@brugmann/vuemann/src/services/form/views/ErrorFormComponent.vue"
import { FormHelper } from "@brugmann/vuemann/src/services/form/form-helper.js"
const props = defineProps({
    modelValue: { type: String, default: '' },
    name : { type: String, required: true },
    placeholder : {type: String, default: undefined},
    label : { type : String, default: undefined },
    required : { type : Boolean, default: false },
    autogrow : { type : Boolean, default: false },
    error : { type: Boolean, default: true },
    form : { type: String, default: undefined },
    maxLength : { type: Number, default: undefined },
})

const characterCount = computed(() => {
    return value.value.length || 0
})

const textarea = ref()
const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() { return props.modelValue },
  set(newValue) {
    emit('update:modelValue', newValue);
  }
});

const autoGrow = () => {
    if(props.autogrow === false) { return }

    textarea.value.style.height = 'auto';
    textarea.value.style.height = textarea.value.scrollHeight + 'px';
}
</script>

<template>
    <div class="form-component">
        <div class="p-relative">
            <textarea        
                :id="FormHelper.getInputName(name, form)" 
                :name="FormHelper.getInputName(name, form)"
                :title="FormHelper.getInputName(name, form)"
                :placeholder="label !== undefined ? ' ' : placeholder"
                class="form-input input" 
                :class="{autogrow : props.autogrow}"
                ref="textarea"
                v-model="value"
                @input="autoGrow"
            >
            </textarea>
            <label 
                v-if="label !== undefined"
                class="form-label"
                :class="{'required': props.required}"
                :for="FormHelper.getInputName(name, form)"
            >
                {{ label }}
            </label>
        </div>
        <div 
            v-if="maxLength !== undefined"
            class="textarea-count | d-flex j-end" 
        >
            <span :class="{ 'color-danger': characterCount > maxLength }" class="fs-300">
                {{ characterCount }}/{{ maxLength }} caractères
            </span>
        </div>
        <ErrorForm 
            v-if="error !== false"
            :name="FormHelper.getInputName(name, form)" 
        />
    </div>
</template>
