<script setup lang="ts">
interface Props {
  modelValue: {
    fixedFrame: string;
    background: string;
  };
  fixedFrames: string[];
}

const props = defineProps<Props>();

defineEmits<{
  (event: 'update:modelValue', value: any): void;
}>();
</script>

<template>
  <a-collapse-item header="Global Options" key="GlobalOptions">
    <a-form :model="modelValue" auto-label-width>
      <a-form-item label="Fixed Frame">
        <a-select
          :model-value="modelValue.fixedFrame"
          allow-create
          @change="
            (v) =>
              $emit('update:modelValue', { ...props.modelValue, fixedFrame: v })
          "
        >
          <a-option v-for="frame in fixedFrames" :key="frame" :value="frame">
            {{ frame }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Background Color">
        <a-color-picker
          :model-value="modelValue.background"
          format="hex"
          disabled-alpha
          @change="
            (v) => {
              $emit('update:modelValue', {
                ...props.modelValue,
                background: v,
              });
            }
          "
        />
      </a-form-item>
    </a-form>
  </a-collapse-item>
</template>

<style scoped></style>
