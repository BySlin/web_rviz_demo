<script setup lang="ts">
import { Channel } from '@foxglove/ws-protocol';
import { Eye, EyeOff } from 'lucide-vue-next';

interface Props {
  show: boolean;
  topics: Record<string, Channel>;
  name: string;
  modelValue: {
    color: string;
    topic: string;
    size: number;
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
  <a-collapse-item :header="name" :key="`laser_scan_${index}`">
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
      <a-form-item label="Topic">
        <a-select
          disabled
          :trigger-props="{ autoFitPopupMinWidth: true }"
          :model-value="modelValue.topic"
          @change="
            (v) => $emit('update:modelValue', { ...props.modelValue, topic: v })
          "
        >
          <template
            v-for="item in Object.values(topics).filter(
              (channel) =>
                channel.schemaName === 'sensor_msgs/LaserScan' ||
                channel.schemaName === 'sensor_msgs/msg/LaserScan',
            )"
          >
            <a-option :value="item.topic">{{ item.topic }}</a-option>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="Size">
        <a-input-number
          :model-value="modelValue.size"
          :min="1"
          :step="1"
          @change="
            (v) => $emit('update:modelValue', { ...props.modelValue, size: v })
          "
        />
      </a-form-item>
      <a-form-item label="Color">
        <a-color-picker
          :model-value="modelValue.color"
          format="hex"
          disabled-alpha
          @change="
            (v) => $emit('update:modelValue', { ...props.modelValue, color: v })
          "
        />
      </a-form-item>
    </a-form>
  </a-collapse-item>
</template>

<style scoped></style>
