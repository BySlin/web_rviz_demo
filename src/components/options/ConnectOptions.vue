<script setup lang="ts">
interface Props {
  modelValue: {
    server: string;
    port: number;
  };
}

const props = defineProps<Props>();

defineEmits<{
  (event: 'update:modelValue', value: any): void;
}>();
</script>

<template>
  <a-collapse-item header="Connect Options" key="ConnectOptions">
    <a-form :model="modelValue" auto-label-width>
      <a-form-item label="Server IP">
        <a-input
          :default-value="modelValue.server"
          @change="
            (v) =>
              $emit('update:modelValue', { ...props.modelValue, server: v })
          "
        >
        </a-input>
      </a-form-item>
      <a-form-item label="Server Port">
        <a-input-number
          :default-value="modelValue.port"
          @change="
            (v) => {
              $emit('update:modelValue', {
                ...props.modelValue,
                port: v,
              });
            }
          "
        />
      </a-form-item>
    </a-form>
  </a-collapse-item>
</template>

<style scoped></style>
