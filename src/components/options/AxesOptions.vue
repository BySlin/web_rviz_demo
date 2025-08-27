<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next';

interface Props {
  name: string;
  show: boolean;
  modelValue: {
    frameId?: string;
    lineType?: 'dashed' | 'full';
  };
  index: number;
  fixedFrames: string[];
  fixedFrame: string;
}

const props = defineProps<Props>();

defineEmits<{
  (event: 'update:modelValue', value: any): void;
  (event: 'update:show', value: boolean): void;
}>();
</script>

<template>
  <a-collapse-item :header="name" :key="`axes_${index}`">
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
    <a-form :model="modelValue" auto-label-width>
      <a-form-item label="Reference Frame">
        <a-select
          :model-value="modelValue.frameId ?? fixedFrame"
          @change="
            (v) =>
              $emit('update:modelValue', { ...props.modelValue, frameId: v })
          "
        >
          <a-option v-for="frame in fixedFrames" :key="frame" :value="frame">
            {{ frame }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Line Type">
        <a-select
          :model-value="modelValue.lineType"
          @change="
            (v) =>
              $emit('update:modelValue', { ...props.modelValue, lineType: v })
          "
        >
          <a-option value="dashed">dashed</a-option>
          <a-option value="full">full</a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-collapse-item>
</template>

<style scoped></style>
