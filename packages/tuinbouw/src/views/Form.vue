<template>
  <div class="mt-10">
    <Form
      @submit="handleSubmit"
      v-slot="{ errors }"
      :validation-schema="schema"
      novalidate
      :initial-values="initialValues"
      ref="form"
    >
      <div class="flex flex-col">
        <label class="block mb-2 text-sm font-medium text-gray-900" for="email"
          >email</label
        >
        <Field
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          name="email"
          id="email"
          :class="{ 'border-red-500': errors.email }"
        />
        <ErrorMessage class="block text-red-500" name="email" />
      </div>

      <div class="flex flex-col mt-5">
        <label
          class="block mb-2 text-sm font-medium text-gray-900"
          for="firstname"
          >firstname</label
        >
        <Field
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          name="firstname"
          id="firstname"
          :class="{ 'border-red-500': errors.firstname }"
        />
        <ErrorMessage class="block text-red-500" name="firstname" />
      </div>

      <div class="flex flex-col mt-5">
        <label
          class="block mb-2 text-sm font-medium text-gray-900"
          for="lastname"
          >lastname</label
        >
        <Field
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          name="lastname"
          id="lastname"
          :class="{ 'border-red-500': errors.lastname }"
        />
        <ErrorMessage class="block text-red-500" name="lastname" />
      </div>

      <CustomButton type="submit" name="Submit" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import {
  ErrorMessage,
  Form,
  Field,
  configure,
  type GenericObject,
} from 'vee-validate'
import { object, string } from 'yup'

// Default values
configure({
  validateOnBlur: false, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: false, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})

const initialValues = {
  email: 'abc@abc.com',
  firstname: 'abc',
  lastname: 'abc',
}

const schema = object({
  email: string().required().email(),
  firstname: string().required(),
  lastname: string().required(),
})

const handleSubmit = async (values: GenericObject) => {
  console.log('submit')
  console.log(values)
}
</script>
