<template>
    <div>
      <div class="form-group">
        <div class="p-inputgroup">
          <InputText type="url" v-model="url" :disabled="formDisabled" />
          <Button label="Add" @click="addUrl" />
        </div>
        <ErrorMessage :errors="errors" />
      </div>
  
      <div v-if="urls.length > 0">
        <div v-for="(item, index) in urls" :key="item.id" class="form-group">
          <div class="p-inputgroup">
            <InputText type="url" v-model="item.url" :value="item.url" :disabled="item.disabled" />
            <Button label="Edit" @click="enableEdit(index)" />
            <Button label="Delete" @click="deleteUrl(index)" />
          </div>
          <ErrorMessage :errors="errors" :index="index" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import ErrorMessage from './ErrorMessage.vue';
  import * as yup from 'yup';
  
  const url = ref('');
  const urls = ref([]);
  const formDisabled = ref(false);
  const errors = ref([]);
  
  const addUrl = () => {
    const schema = yup.object().shape({
      url: yup.string().url().matches(/^https:/, 'URL must start with "https://"').required('URL is required'),
    });
  
    schema.validate({ url: url.value })
      .then(validUrl => {
        urls.value.push({ id: urls.value.length + 1, url: validUrl.url, disabled: true, error:'' });
        console.log("Urls list", urls.value[0]);
        url.value = '';
      })
      .catch(error => {
        errors.value.push(error.message);
      });
  };

  const editSave = () => {
    const schema = yup.object().shape({
      url: yup.string().url().matches(/^https:/, 'URL must start with "https://"').required('URL is required'),
    });
  
    schema.validate({ url: url.value })
      .then(validUrl => {
        urls.value.push({ id: urls.value.length + 1, url: validUrl.url, disabled: true });
        console.log("Urls list", urls.value[0]);
        url.value = '';
      })
      .catch(error => {
        errors.value.push(error.message);
      });
  };
  
  const deleteUrl = (index) => {
    urls.value.splice(index, 1);
  };
  
  const enableEdit = (index) => {
    urls.value.forEach((item, idx) => {
      item.disabled = idx !== index;
    });
  };
  </script>
  