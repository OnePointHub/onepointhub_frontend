<script setup lang="ts">
import { useFieldError, useForm } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
  layout: 'auth',
  middleware: ['sanctum:guest'],
})

/* Check for message in the URL query */
const route = useRoute()
const successMessage = ref()

onMounted(() => {
  if (route.query.status) {
    if (route.query.status === 'Password reset') {
      successMessage.value = 'Your password has been reset.'
    }
  }
})

/* Form Validation Rules */
const formSchema = yup.object().shape({
  email: yup
    .string()
    .required('The email field is required.')
    .email('Email must be a valid email address.'),
  password: yup
    .string()
    .required('The password field is required.'),
  remember: yup
    .boolean(),
})

/* Initialize Form */
const { defineField, handleSubmit, meta } = useForm({
  initialValues: {
    email: '',
    password: '',
    remember: false,
  },
  validationSchema: formSchema,
})

/* Form Data */
const [email] = defineField('email')
const [password] = defineField('password')
const [remember] = defineField('remember')

/* Form Errors */
const emailErr = useFieldError('email')
const passwordErr = useFieldError('password')

/* Form Submit */
const { login } = useSanctumAuth()
const loginError = ref()

const onSubmit = handleSubmit(async (values) => {
  loginError.value = ''
  const credentials = {
    email: values.email,
    password: values.password,
    remember: values.remember,
  }

  try {
    await login(credentials)
  }
  catch (e) {
    const error = useApiError(e)

    if (error.isValidationError) {
      loginError.value = (error.bag.email[0])
      return
    }
    console.error('Request failed not because of a validation', error.code)
  }
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
          Login to OnePointHub
        </h5>
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
          v-show="loginError"
          class="mt-2 text-sm text-error"
        >
          {{ loginError }}
        </p>
        <p
          v-show="emailErr"
          class="mt-2 text-sm text-error"
        >
          {{ emailErr }}
        </p>
      </div>
      <div>
        <label
          for="password"
          class="block mb-2 text-sm font-medium"
          :class="[passwordErr ? 'text-error' : 'text-main']"
        >
          Your password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          class="border text-sm rounded-lg focus:outline-none focus:border-2 block w-full p-2.5"
          :class="[passwordErr
            ? 'bg-error-50 border-error text-error placeholder-error focus:border-error'
            : 'bg-background border-secondary text-main focus:border-primary']"
        >
        <p
          v-show="passwordErr"
          class="mt-2 text-sm text-error"
        >
          {{ passwordErr }}
        </p>
      </div>
      <div class="flex items-start">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="remember"
              v-model="remember"
              type="checkbox"
              class="w-4 h-4 accent-primary"
            >
          </div>
          <label
            for="remember"
            class="ms-2 text-sm font-medium text-main"
          >
            Remember me
          </label>
        </div>
        <NuxtLink
          to="/forgot-password"
          class="ms-auto text-sm text-secondary hover:text-primary hover:underline"
        >
          Lost Password?
        </NuxtLink>
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
        Login in to your account
      </button>
    </form>
  </div>
</template>
:disabled="!meta.touched || !meta.valid"
