<!-- TODO: delete this example code -->

<template>
  <div class="mt-10">
    <DynamicForm
      :schema="formSchema"
      :validationSchema="validationSchema"
      :handleForm="handleSubmit"
      :loading="false"
      :initialValues="{}"
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
      placeholder: '••••••••',
      as: 'input',
      type: 'password',
    },
    {
      label: 'Select Type',
      name: 'type',
      as: 'select',
      type: 'select',
      options: ABSENCE_TYPES,
      placeholder: 'Select a type',
    },
    {
      label: 'Select Date',
      name: 'date',
      as: 'input',
      type: 'date',
      placeholder: 'Select a date',
      minDate: new Date(),
    },
    {
      label: 'Description',
      name: 'description',
      as: 'textarea',
      type: 'textarea',
      placeholder: 'Reason for absence',
      rows: 10,
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
