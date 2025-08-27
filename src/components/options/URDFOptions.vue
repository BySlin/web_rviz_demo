<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next';
import { Channel } from '@foxglove/ws-protocol';

interface Props {
  show: boolean;
  topics: Record<string, Channel>;
  name: string;
  modelValue: {
    topic?: string;
  };
  index: number;
}

const props = defineProps<Props>();

defineEmits<{
  (event: 'update:modelValue', value: any): void;
  (event: 'update:show', value: boolean): void;
}>();
</script>

<template>
  <a-collapse-item :header="name" :key="`urdf_${index}`">
    <template #extra>
      <a-button
        type="text"
        size="mini"
        @click.stop="() => $emit('update:show', !show)"
      >
        <template #icon>
          <Eye :size="16" v-if="show" />
          <EyeOff :size="16" v-else />
        </template>
      </a-button>
    </template>
    <a-form :model="modelValue" auto-label-width></a-form>
  </a-collapse-item>
</template>

<style scoped></style>
