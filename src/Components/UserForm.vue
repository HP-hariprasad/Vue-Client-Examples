<script setup>
import InputText from 'primevue/inputtext';

const onSubmit=(event)=>{
    console.log("onSubmit event", event);
}

const triggerOnSubmit = () => {
    const form = this.$el.querySelector('form');
    if (form) {
        const event = new Event('submit', { cancelable: true });
        form.dispatchEvent(event);
    }
}

defineExpose({ triggerOnSubmit });
</script>

<template>
    <form @submit="onSubmit">
        <div class="card flex justify-content-center">
            <InputText type="text" v-model="username" />
        </div>
        <div class="card flex justify-content-center">
            <InputText type="text" v-model="firstName" />
        </div>
        <div class="card flex justify-content-center">
            <InputText type="text" v-model="lastnanme" />
        </div>
    </form>
</template>

