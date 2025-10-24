<script lang="ts" setup>
import { reactive } from 'vue';
import * as v from 'valibot'
import { requestSignIn } from './api/requestSignIn';
import { useMeStore } from '@/entities/user';
import { useRouter } from 'vue-router';


const vForm = v.object({
  email: v.pipe(
    v.string(),
    v.email()
  ),
  password: v.pipe(
    v.string(),
    v.minLength(6)
  )
});


const formState = reactive({
  email: '',
  password: ''
});

const router = useRouter()
const meStore = useMeStore()


const handleSubmit = async () => {
  const result = v.safeParse(vForm, formState);
  if (!result.success) {
    console.error('Validation errors:', result.issues);
  }
  try {
    const user = await requestSignIn({
      email: formState.email,
      password: formState.password
    })
    meStore.setMe(user)
    router.push('/')
  } catch (error) {
    console.error('Submission error:', error);
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="email">Email</label>
      <input v-model="formState.email" id="email" type="email" />
    </div>
    <div>
      <label for="password">Password</label>
      <input v-model="formState.password" id="password" type="password" />
    </div>
    <button type="submit">Login</button>
  </form>
</template>
