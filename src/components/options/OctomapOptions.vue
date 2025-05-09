<script setup lang="ts">
import { Channel } from '@foxglove/ws-protocol';
import { Eye, EyeOff } from 'lucide-vue-next';

interface Props {
  show: boolean;
  topics: Record<string, Channel>;
  name: string;
  modelValue: {
    topic: string;
    voxelRenderMode: 'occupied' | 'free' | 'all';
    colorMode: 'cellColor' | 'zAxisColor' | 'probabilityColor';
    opacity: number;
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
  <a-collapse-item :header="name" :key="`octomap_${index}`">
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
                channel.schemaName === 'octomap_msgs/Octomap' ||
                channel.schemaName === 'octomap_msgs/msg/Octomap',
            )"
          >
            <a-option :value="item.topic">{{ item.topic }}</a-option>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="Voxel Coloring">
        <a-select
          :model-value="modelValue.colorMode"
          @change="
            (v) =>
              $emit('update:modelValue', {
                ...props.modelValue,
                colorMode: v,
              })
          "
        >
          <a-option value="cellColor">Cell Color</a-option>
          <a-option value="zAxisColor">Z-Axis</a-option>
          <a-option value="probabilityColor">Cell Probability</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Voxel Rendering">
        <a-select
          :model-value="modelValue.voxelRenderMode"
          @change="
            (v) =>
              $emit('update:modelValue', {
                ...props.modelValue,
                voxelRenderMode: v,
              })
          "
        >
          <a-option value="occupied">Occupied Voxels</a-option>
          <a-option value="free">Free Voxels</a-option>
          <a-option value="all">All Voxels</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Voxel Aplha">
        <a-input-number
          :model-value="modelValue.opacity"
          :min="0"
          :max="1"
          :step="0.1"
          @change="
            (v) =>
              $emit('update:modelValue', {
                ...props.modelValue,
                opacity: v,
              })
          "
        />
      </a-form-item>
    </a-form>
  </a-collapse-item>
</template>

<style scoped></style>
