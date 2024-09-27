<script setup lang="ts">
import { useFieldError, useForm } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
  layout: 'auth',
  middleware: ['sanctum:guest'],
})

/* Form Validation Rules */
const formSchema = yup.object().shape({
  email: yup
    .string()
    .required('The email field is required.')
    .email('Email must be a valid email address.'),
})

/* Initialize Form */
const { defineField, handleSubmit, meta } = useForm({
  initialValues: {
    email: '',
  },
  validationSchema: formSchema,
})

/* Form Data */
const [email] = defineField('email')

/* Form Errors */
const emailErr = useFieldError('email')

/* Form Submit */
const client = useSanctumClient()
const loading = ref(false)
const errMessage = ref()
const successMessage = ref()

const onSubmit = handleSubmit(async (values) => {
  errMessage.value = ''
  const credentials = {
    email: values.email,
  }

  try {
    loading.value = true
    await client('/forgot-password', {
      method: 'POST',
      body: credentials,
    })
    successMessage.value = 'We have emailed your password reset link.'
  }
  catch (e) {
    const error = useApiError(e)

    if (error.isValidationError) {
      errMessage.value = (error.bag.email[0])
      loading.value = false
      return
    }
    console.error('Request failed not because of a validation', error.code)
  }
  loading.value = false
})
</script>

<template>
  <div class="w-96 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
    <form
      class="space-y-6"
      @submit.prevent="onSubmit"
    >
      <div class="mb-4">
        <h5 class="text-xl text-center font-bold text-primary">
          Forgot your password?
        </h5>
        <small class="text-main">
          Just let us know your email address and we will email you a password reset link that will
          allow you to choose a new one.
        </small>
      </div>
      <small
        :class="successMessage ? 'text-success text-sm pb-4' : ''"
      >
        {{ successMessage }}
      </small>
      <div>
        <label
          for="email"
          class="block mb-2 text-sm font-medium"
          :class="[emailErr ? 'text-error' : 'text-main']"
        >
          Your email
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          name="email"
          class="border text-sm rounded-lg focus:outline-none focus:border-2 block w-full p-2.5"
          :class="[emailErr
            ? 'bg-error-50 border-error text-error placeholder-error focus:border-error'
            : 'bg-background border-secondary text-main focus:border-primary']"
        >
        <p
          v-show="errMessage"
          class="mt-2 text-sm text-error"
        >
          {{ errMessage }}
        </p>
        <p
          v-show="emailErr"
          class="mt-2 text-sm text-error"
        >
          {{ emailErr }}
        </p>
      </div>
      <button
        :disabled="!meta.valid"
        type="submit"
        class="w-full text-white bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center
          hover:shadow-primary hover:shadow-sm hover:bg-primary
          transition duration-150 ease-in-out active:bg-primary-600 active:shadow-primary-600
          motion-reduce:transition-none
          disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-main disabled:shadow-none"
      >
        <span v-if="loading">
          <Icon
            name="mdi:loading"
            class="animate-spin w-4 h-4"
          />
        </span>
        <span v-else>
          Email Password Reset Link
        </span>
      </button>
    </form>
  </div>
</template>
