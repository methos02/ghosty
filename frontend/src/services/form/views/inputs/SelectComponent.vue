<script setup>
import ErrorForm from "@/services/form/views/ErrorFormComponent.vue"
import { FormHelper } from "@/services/form/form-helper.js"
const props = defineProps({
    name : { type: String, required: true },
    label : { type : String, default: '' },
    required : { type : Boolean, default: false },
    error : { type: Boolean, default: true },
    form : { type: String, default: undefined },
    containerClass : { type: String, default: '' },
})

const select = defineModel({type : [Number, String, Object], default: undefined})
</script>

<template>
<div class="select-container | p-relative" :class="props.containerClass">
    <select 
        :id="FormHelper.getInputName(name, form)" 
        :name="FormHelper.getInputName(name, form)"
        class="form-input input" 
        :class="{'valid': select !== undefined}"
        v-model="select"
    >
        <option value="" disabled hidden></option>
        <slot></slot>
    </select>
    <label 
        v-if="label !== ''"
        class="form-label"
        :class="{'required': props.required}"
        :for="FormHelper.getInputName(name, form)"
    >
        {{ label }}
    </label>
    <ErrorForm 
        v-if="error !== false"
        :name="FormHelper.getInputName(name, form)" 
    />
</div>
</template>
