<template>
  <div class="mt-10">
    <DynamicForm
      :schema="formSchema"
      :validationSchema="validationSchema"
      :handleForm="handleSubmit"
      :loading="false"
      :initialValues="{
        name: 'John Doe',
        email: 'johon@gmail.com',
        password: '123456',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/generic/DynamicForm.vue'
import { ABSENCE_TYPES } from '@/helpers/constants'
import type { GenericObject } from 'vee-validate'
import * as yup from 'yup'

const validationSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  type: yup.string().required(),
})

const formSchema = {
  fields: [
    {
      label: 'Your Name',
      name: 'name',
      placeholder: 'John Doe',
      as: 'input',
    },
    {
      label: 'Your Email',
      name: 'email',
      placeholder: 'john@gmail.com',
      as: 'input',
    },
    {
      label: 'Your Password',
      name: 'password',
      placeholder: '********',
      as: 'input',
      type: 'password',
    },
    // {
    //   label: 'Select Date',
    //   name: 'date',
    //   as: 'input',
    //   type: 'date',
    // },
    {
      label: 'Select Type',
      name: 'type',
      as: 'select',
      type: 'select',
      // options: [
      //   { label: 'Select an option', value: '', disabled: true },
      //   { label: 'Option 1', value: '1' },
      //   { label: 'Option 2', value: '2' },
      // ],
      options: ABSENCE_TYPES,
      placeholder: 'Select a type',
    },
  ],

  button: {
    name: 'Create',
  },
}

const handleSubmit = (values: GenericObject) => {
  console.log(values)
}
</script>
