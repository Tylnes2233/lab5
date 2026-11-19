<script setup lang="ts">
import { reactive, ref } from 'vue'
import { PlusCircle, X } from 'lucide-vue-next'
import type { CreateGamePayload } from '../types/workshop'

defineProps<{
  open: boolean
  submitting?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: CreateGamePayload]
}>()

const validationError = ref('')

const form = reactive<CreateGamePayload>({
  title: '',
  genre: 'Action',
  price: 399,
  discount: 0,
  developer: '',
  image_url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80',
  description: ''
})

const handleSave = () => {
  validationError.value = ''
  if (!form.title.trim()) {
    validationError.value = 'Введіть назву гри'
    return
  }
  if (!form.genre.trim()) {
    validationError.value = 'Вкажіть жанр гри'
    return
  }
  if (Number(form.price) <= 0) {
    validationError.value = 'Базова ціна повинна бути більшою за 0'
    return
  }
  if (Number(form.discount) < 0 || Number(form.discount) > 90) {
    validationError.value = 'Знижка має бути від 0 до 90%'
    return
  }

  emit('submit', { ...form })
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': open }">
    <div class="modal-box max-w-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-lg flex items-center gap-2">
          <PlusCircle class="w-5 h-5 text-primary" />
          Додати нову інді-гру
        </h3>
        <button type="button" class="btn btn-sm btn-circle btn-ghost" @click="emit('close')">
          <X class="w-4 h-4" />
        </button>
      </div>

      <div v-if="validationError" class="alert alert-error text-xs py-2 mb-3">
        <span>{{ validationError }}</span>
      </div>

      <form class="space-y-3" @submit.prevent="handleSave">
        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs font-semibold">Назва гри *</span></label>
          <input v-model="form.title" type="text" class="input input-bordered input-sm w-full" required />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="form-control">
            <label class="label py-1"><span class="label-text text-xs font-semibold">Жанр *</span></label>
            <input v-model="form.genre" type="text" class="input input-bordered input-sm w-full" required />
          </div>

          <div class="form-control">
            <label class="label py-1"><span class="label-text text-xs font-semibold">Розробник</span></label>
            <input v-model="form.developer" type="text" class="input input-bordered input-sm w-full" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="form-control">
            <label class="label py-1"><span class="label-text text-xs font-semibold">Базова ціна (₴) *</span></label>
            <input v-model.number="form.price" type="number" min="1" class="input input-bordered input-sm w-full" required />
          </div>

          <div class="form-control">
            <label class="label py-1"><span class="label-text text-xs font-semibold">Знижка (0–90%)</span></label>
            <input v-model.number="form.discount" type="number" min="0" max="90" class="input input-bordered input-sm w-full" />
          </div>
        </div>

        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs font-semibold">URL обкладинки</span></label>
          <input v-model="form.image_url" type="url" class="input input-bordered input-sm w-full" />
        </div>

        <div class="form-control">
          <label class="label py-1"><span class="label-text text-xs font-semibold">Опис гри</span></label>
          <textarea v-model="form.description" class="textarea textarea-bordered textarea-sm w-full" rows="3"></textarea>
        </div>

        <div class="modal-action">
          <button type="button" class="btn btn-sm btn-ghost" @click="emit('close')">Скасувати</button>
          <button type="submit" class="btn btn-sm btn-primary" :disabled="submitting">
            Зберегти гру
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button type="button" @click="emit('close')">close</button>
    </form>
  </dialog>
</template>