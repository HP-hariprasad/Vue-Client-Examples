<template>
    <div v-if="errors.length > 0" class="error-message">
        <ul>
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    errors: Array,
});
</script>

<style scoped>
.error-message {
    color: red;
}
</style>