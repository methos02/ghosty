<script setup>
import {ref} from "vue";
import ErrorForm from "@/services/form/views/ErrorFormComponent.vue"
import { FormHelper } from "@/services/form/form-helper.js"
const props = defineProps({
    name : { type: String, required: true },
    type : { type : String, default: 'text' },
    label : { type : String, required: true },
    required : { type : Boolean, default: false },
    error : { type: Boolean, default: true },
    autocomplete : { type: String, default: 'off' },
    readonly : { type: Boolean, default: false },
    form : { type: String, default: undefined },
    containerClass : { type: String, default: '' },
})

const input = defineModel({type : [String, Number], default: ''})

const isPassword = props.type === 'password'
const type = ref(props.type)

const togglePassword = () => {
    type.value = type.value === 'password' ? 'text' : 'password'
}

</script>

<template>
    <div class="form-component" :class="props.containerClass">
        <div class="p-relative">
            <input 
                :id="FormHelper.getInputName(name, form)" 
                :name="FormHelper.getInputName(name, form)"
                :type="type" 
                :autocomplete="autocomplete"
                class="form-input input" 
                v-model="input"
                placeholder=" "
                :readonly="readonly"
            />
            <label 
                class="form-label"
                :class="{'required': props.required}"
                :for="FormHelper.getInputName(name, form)"
            >
                {{ label }}
            </label>
            <button 
                v-if="isPassword" 
                class="input-button | d-flex align-center"
                type="button"
                title="show password"
                data-toggle="password"
                @click="togglePassword" 
            >
                <i class="fa-solid mx-15" :class="type === 'password' ? 'fa-eye' : 'fa-eye-slash'"></i>
            </button>
        </div>
        <ErrorForm 
            v-if="error !== false"
            :name="FormHelper.getInputName(name, form)" 
        />
    </div>
</template>

<style lang="scss">
.form-component {
    .input-button {
        position: absolute;
        inset: 13px 0 0 auto;

        cursor: pointer;
    
        i { color: gray; }
    }
}
</style>
