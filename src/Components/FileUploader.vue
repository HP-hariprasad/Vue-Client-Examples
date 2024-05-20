<template>
    <div class="card">
        <h1>File Uploader Component</h1>
        <FileUpload custom-upload uploadLabel="Files" :showUploadButton="false" @select="handleFileSelect"
            :multiple="true" :maxFileSize="1000000">
            <template>
                <div v-if="files && files.length > 0">
                    <h5>Completed</h5>
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div v-for="(file, index) of files" :key="file.name + index"
                            class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                            <div>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100"
                                    height="50" />
                            </div>
                            <span class="font-semibold">{{ file.name }}</span>
                            <template v-if="file">
                                <Badge value="Completed" class="mt-3" severity="success" />
                                <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded
                                    severity="danger" />
                            </template>
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <p>Drag and drop files to here to upload.</p>
            </template>
        </FileUpload>
        <div class="submit-button flex" @click="handleSubmit">
            <Button label="Submit" />
        </div>
        <div class="submit-button flex" @click="handleDownloadFile">
            <Button label="Download File" />
        </div>
        <div class="submit-button flex" @click="handleModal">
            <Button label="Open Dialog" />
        </div>
    </div>
    <Dialog v-model:visible="FileStore.modalVisible" modal :style="{ width: '50rem', overflow: 'hidden !important' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <span class="font-bold white-space-nowrap">Header</span>
            </div>
        </template>
        <UserForm ref="childForm" />
        <template #footer>
            <Button label="Cancel" text severity="secondary" @click="handleDialogClose" autofocus />
            <Button label="Save" outlined severity="secondary" @click="handleSave" autofocus />
        </template>
    </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import {provideApolloClient, useMutation } from '@vue/apollo-composable';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import UserForm from './UserForm.vue';
import { gql } from 'graphql-tag';
import { FileStore } from '../Store/FileStore';
import { fileBaseData } from './Constants.js';
import client from '../apollo'

provideApolloClient(client)
const urls = ref([]);

const UPLOAD_FILE_MUTATION = gql`
    mutation submitForm($input: FormInput!) {
      submitForm(input: $input) {
        success
        message
      }
    }
  `;

const { mutate: callFileSubmit, onDone, onError } = useMutation(UPLOAD_FILE_MUTATION);

const removeUploadedFileCallback = (index) => {
    FileStore.files.splice(index, 1);
};

const onAdvancedUpload = (event) => {
    urls.value.push(event.files);
};

const handleFileSelect = (event) => {
    console.log('Select file event', event);
    urls.value.push(event.files);
};

const handleDownloadFile = () => {
    const base64String = fileBaseData;
    const binaryData = atob(base64String);
    const blob = new Blob([binaryData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'document.pdf';
    downloadLink.click();
};

const handleSubmit = async () => {
    
    const uploadedFiles = urls.value.flatMap((fileArray) => fileArray.map((file) => file));
    console.log('Uploaded files are :', uploadedFiles);

    try {
        const file = uploadedFiles[0];
        const { name, email } = { name: 'Test Name', email: 'test@example.com' };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('email', email);
        const fileData = {
            name,
            email,
            file: formData.get('file'),
        }
        const response = await callFileSubmit({
            input: fileData,
        });

        console.log('File uploaded successfully:', response.data.submitForm);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

const handleModal = () => {
    FileStore.modalVisible = !FileStore.modalVisible;
};

const handleSave = () => {
    refs.childForm.triggerOnSubmit();
};

const handleDialogClose = () => {
    console.log('Dialog is closing');
    FileStore.nestedModalVisible = !FileStore.nestedModalVisible;
};
</script>

<style scoped>
.card {
    margin: 5rem;
    width: 50rem;
}

.submit-button {
    margin-top: 10px;
}

.close-button {
    float: right;
    margin-left: auto;
}

.p-dialog-content {
    overflow-y: hidden !important;
}
</style>