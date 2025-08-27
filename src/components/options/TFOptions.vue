<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next';

type TFTreeNode = {
  key: string;
  title: string;
  value: string;
  children: TFTreeNode[];
};

interface Props {
  name: string;
  show: boolean;
  modelValue: {
    lineColor: string;
    showLines: boolean;
    showLabels: boolean;
    frameVisible?: Record<string, boolean>;
  };
  index: number;
  fixedFrames: string[];
  fixedFrame: string;
  tfTree: TFTreeNode[];
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
      <a-form-item label="Line Color">
        <a-color-picker
          :model-value="modelValue.lineColor"
          format="hex"
          disabled-alpha
          @change="
            (v) =>
              $emit('update:modelValue', { ...props.modelValue, lineColor: v })
          "
        />
      </a-form-item>
      <a-form-item label="Show Line">
        <a-switch
          :model-value="modelValue.showLines"
          @change="
            (v) =>
              $emit('update:modelValue', { ...props.modelValue, showLines: v })
          "
        />
      </a-form-item>
      <a-form-item label="Show Label">
        <a-switch
          :model-value="modelValue.showLabels"
          @change="
            (v) =>
              $emit('update:modelValue', { ...props.modelValue, showLabels: v })
          "
        />
      </a-form-item>

      <a-form-item :label="item" v-for="item in fixedFrames" :key="item">
        <a-switch
          :model-value="modelValue.frameVisible[item]"
          :default-checked="true"
          @change="
            (v) =>
              $emit('update:modelValue', {
                ...props.modelValue,
                frameVisible: {
                  ...props.modelValue.frameVisible,
                  [item]: v,
                },
              })
          "
        />
      </a-form-item>
    </a-form>
  </a-collapse-item>
</template>

<style scoped></style>
