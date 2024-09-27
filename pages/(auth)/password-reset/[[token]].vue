<script setup lang="ts">
import {useForm, useFieldError} from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
  layout: 'auth',
  middleware: ['sanctum:guest']
})

/* Form Validation Rules */
const formSchema = yup.object().shape({
  email: yup
      .string()
      .required('The email field is required.')
      .email('Email must be a valid email address.'),
  password: yup
      .string()
      .required('The password field is required.')
      .matches(/[a-z]/, 'Password must contain at least one letter.')
      .matches(/[0-9]/, 'Password must contain at least one number.')
      .matches(/[A-Z]/, 'Password must contain at least one capital letter.')
      .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.')
      .min(8, 'Password must be at least 8 characters long.'),
  password_confirmation: yup
      .string()
      .required('The password field is required.')
      .oneOf([yup.ref('password')], 'Passwords do not match.')
})

/* Initialize Form */
const {defineField, handleSubmit, meta} = useForm({
  initialValues: {
    email: '',
    password: '',
    password_confirmation: '',
  },
  validationSchema: formSchema
})

/* Form Data */
const [email] = defineField('email')
const [password] = defineField('password')
const [password_confirmation] = defineField('password_confirmation')

/* Form Errors */
const emailErr = useFieldError('email')
const passwordErr = useFieldError('password')
const password_confirmationErr = useFieldError('password_confirmation')

/* Get Token from Route Params */
const route = useRoute()
const token = ref()

if (route.params.token) {
  token.value = route.params.token
}

/* Get Email from Route Query */
if (route.query.email) {
  email.value = route.query.email
}

/* Form Submit */
const client = useSanctumClient()
const emailError = ref()
const passwordError = ref()

const onSubmit = handleSubmit(async values => {
  emailError.value = ''
  passwordError.value = ''
  const credentials = {
    token: token.value,
    email: values.email,
    password: values.password,
    password_confirmation: values.password_confirmation,
  }

  try {
    await client('/reset-password', {
      method: 'POST',
      body: credentials,
    })
    await navigateTo({
      path: '/login',
      query: {
        status: 'Password reset',
      }
    })
  } catch (e) {
    const error = useApiError(e)

    if (error.isValidationError) {
      if (error.bag['email']) {
        emailError.value = (error.bag['email'][0])
      }
      if (error.bag['password']) {
        passwordError.value = (error.bag['password'][0])
      }
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
          Reset Password
        </h5>
      </div>
      <div>
        <label
            for="email"
            class="block mb-2 text-sm font-medium"
            :class="[ emailErr ? 'text-error': 'text-main']"
        >
          Your email
        </label>
        <input
            v-model="email"
            type="email"
            name="email"
            id="email"
            class="border text-sm rounded-lg focus:outline-none focus:border-2 block w-full p-2.5"
            :class="[ emailErr
              ? 'bg-error-50 border-error text-error placeholder-error focus:border-error'
              : 'bg-background border-secondary text-main focus:border-primary']"

        />
        <p
            v-show="emailError"
            class="mt-2 text-sm text-error"
        >
          {{ emailError }}
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
            :class="[ passwordErr ? 'text-error': 'text-main']"
        >
          Your password
        </label>
        <input
            v-model="password"
            type="password"
            name="password"
            id="password"
            class="border text-sm rounded-lg focus:outline-none focus:border-2 block w-full p-2.5"
            :class="[ passwordErr
              ? 'bg-error-50 border-error text-error placeholder-error focus:border-error'
              : 'bg-background border-secondary text-main focus:border-primary']"
        />
        <p
            v-show="passwordError"
            class="mt-2 text-sm text-error"
        >
          {{ passwordError }}
        </p>
        <p
            v-show="passwordErr"
            class="mt-2 text-sm text-error"
        >
          {{ passwordErr }}
        </p>
      </div>
      <div>
        <label
            for="password"
            class="block mb-2 text-sm font-medium"
            :class="[ password_confirmationErr ? 'text-error': 'text-main']"
        >
          Your password confirmation
        </label>
        <input
            v-model="password_confirmation"
            type="password"
            name="password"
            id="password"
            class="border text-sm rounded-lg focus:outline-none focus:border-2 block w-full p-2.5"
            :class="[ password_confirmationErr
              ? 'bg-error-50 border-error text-error placeholder-error focus:border-error'
              : 'bg-background border-secondary text-main focus:border-primary']"
        />
        <p
            v-show="password_confirmationErr"
            class="mt-2 text-sm text-error"
        >
          {{ password_confirmationErr }}
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
        Email Password Reset Link
      </button>
    </form>
  </div>
</template>
