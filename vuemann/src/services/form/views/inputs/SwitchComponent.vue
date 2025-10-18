<script setup>
import { computed, watchEffect } from 'vue'
import ErrorForm from "@brugmann/vuemann/src/services/form/views/ErrorFormComponent.vue"
import { FormHelper } from "@brugmann/vuemann/src/services/form/form-helper.js"

const props = defineProps({
    name : { type: String, required: true },
    prefix : { type : String, default: '' },
    suffix : { type : String, default: '' },
    required : { type : Boolean, default: false },
    error : { type: Boolean, default: true },
    form : { type: String, default: undefined },
    disabled : { type: Boolean, default: false },
    values : { type: Object, default: () => ({ true: true, false: false }) },
})

const switchValue = defineModel({type: [Boolean, String, Number], default: false})

watchEffect(() => {
    if (props.prefix === '' && props.suffix === '') {
        throw new Error(`SwitchComponent "${props.name}": Au moins un des deux (prefix ou suffix) doit être rempli`)
    }
})

const internalValue = computed({
    get() {
        return switchValue.value === props.values.true
    },
    set(newValue) {
        switchValue.value = newValue ? props.values.true : props.values.false
    }
})
</script>

<template>
    <div class="form-component switch-component">
        <div class="switch-wrapper">
            <input 
                :id="FormHelper.getInputName(name, form)" 
                :name="FormHelper.getInputName(name, form)"
                type="checkbox" 
                class="switch-input" 
                v-model="internalValue"
                :disabled="disabled"
            />
            <label 
                class="switch-label"
                :for="FormHelper.getInputName(name, form)"
            >
                <span 
                    v-if="prefix !== ''"
                    class="switch-text" 
                    :class="{'required': props.required && suffix === ''}"
                    data-switch="prefix"
                >
                    {{ prefix }}
                </span>
                <span class="switch-slider" :class="{ 'active': internalValue }"></span>
                <span 
                    v-if="suffix !== ''"
                    class="switch-text" 
                    :class="{'required': props.required}"
                    data-switch="suffix"
                >
                    {{ suffix }}
                </span>
            </label>
        </div>
        <ErrorForm 
            v-if="error !== false"
            :name="FormHelper.getInputName(name, form)" 
        />
    </div>
</template>

<style lang="scss">
.switch-component {
    .switch-wrapper {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 5px;
    }

    .switch-input {
        display: none;
    }

    .switch-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        user-select: none;
    }

    .switch-slider {
        position: relative;
        width: 50px;
        height: 24px;
        background-color: var(--neutral-400);
        border-radius: 24px;
        transition: background-color 0.3s ease;

        &::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background-color: var(--neutral-100);
            border-radius: 50%;
            transition: transform 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
    }

    .switch-slider.active {
        background-color: var(--primary);

        &::before {
            transform: translateX(26px);
        }
    }

    .switch-input:disabled + .switch-label {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .switch-text {
        font-size: 14px;
        color: var(--neutral-900);

        &.required::after {
            content: ' *';
            color: var(--danger);
        }
    }
}
</style>
