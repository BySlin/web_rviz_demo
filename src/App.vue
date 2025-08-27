<template>
  <div class="main-viewer">
    <a-layout>
      <a-layout-sider :width="350">
        <div class="sider-content">
          <a-collapse :default-active-key="['GlobalOptions', 'ConnectOptions']">
            <ConnectOptions v-model="rvizOptions.connectOptions" />
            <GlobalOptions
              :fixed-frames="fixedFrames"
              v-model="rvizOptions.globalOptions"
            />
            <template
              v-for="(item, index) in rvizOptions.items"
              :key="item.name"
            >
              <component
                :is="OptionComponents[item.type]"
                v-model="item.options"
                v-model:show="item.show"
                :fixed-frame="rvizOptions.globalOptions.fixedFrame"
                :fixed-frames="fixedFrames"
                :tf-tree="tfTree"
                :topics="topics"
                :name="item.name"
                :index="index"
              />
            </template>
          </a-collapse>
        </div>
      </a-layout-sider>
      <a-layout-content>
        <Viewer
          :debug="true"
          :url="wsServer"
          :reconnect-time="3000"
          :click-topic="clickTopic"
          :camera-type="cameraType"
          :fixed-frame="rvizOptions.globalOptions.fixedFrame"
          :background="rvizOptions.globalOptions.background"
          @fixed-frames="setFixedFrames"
          @tf-tree-updated="setTFTree"
          @support-view-topics="setSupportViewTopics"
          ref="viewerRef"
        >
          <template v-for="(item, index) in rvizOptions.items" :key="item.name">
            <template v-if="item.show">
              <component
                :is="ViewerComponents[item.type]"
                :key="index"
                :options="item.options"
              />
            </template>
          </template>
        </Viewer>
        <div class="controls">
          <a-button @click="switchCameraType" size="mini">
            {{ cameraType }}
          </a-button>
          <a-dropdown-button
            style="margin-top: 10px"
            size="mini"
            @click="startClickPose"
          >
            <ArrowUpRight />
            <template #content>
              <a-doption
                v-for="item in clickTopics"
                :key="item.topic"
                @click="() => setClickTopic(item)"
                class="click-topic"
                :class="{ active: clickTopic?.topic === item.topic }"
              >
                <div>
                  {{ item.topic }}
                </div>
              </a-doption>
            </template>
          </a-dropdown-button>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
  <div class="image" ref="imageRef"></div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowUpRight } from 'lucide-vue-next';
import { useLocalStorage } from '@vueuse/core';
import { OptionComponents } from './components/options';
import { Channel, Viewer, ViewerComponents } from '@byslin/web_rviz';
import GlobalOptions from './components/options/GlobalOptions.vue';
import ConnectOptions from './components/options/ConnectOptions.vue';

type TFTreeNode = {
  key: string;
  title: string;
  value: string;
  children: TFTreeNode[];
};

const imageRef = ref<HTMLDivElement>(null);
const viewerRef = ref<
  { startClick: (type: 'pose' | 'point') => void } | undefined
>(undefined);
const cameraType = ref<'2D' | '3D'>('3D');
const fixedFrames = ref<string[]>([]);
const tfTree = ref<TFTreeNode[]>([]);
const topics = ref<Record<string, Channel>>({});
const clickTopics = ref<Channel[]>([]);
const clickTopic = ref<Channel | undefined>(undefined);
const rvizOptions = useLocalStorage<{
  connectOptions: {
    server: string;
    port: number;
  };
  globalOptions: {
    fixedFrame: string;
    background: string;
  };
  items: {
    type: string;
    name: string;
    show: boolean;
    options: any;
  }[];
}>(
  'rvizOptions',
  {
    connectOptions: {
      server: location.hostname,
      port: 8765,
    },
    globalOptions: {
      fixedFrame: 'map',
      background: '#303030',
    },
    items: [
      {
        type: 'Grid',
        name: 'Grid',
        show: true,
        options: {
          color: '#248EFF',
          cellSize: 1,
          numCells: 10,
        },
      },
      {
        type: 'URDF',
        name: 'URDF',
        show: true,
        options: {},
      },
      {
        type: 'TF',
        name: 'TF',
        show: true,
        options: {
          lineColor: '#FF0000',
          showLines: true,
          showLabels: true,
          frameVisible: {},
        },
      },
      {
        type: 'Axes',
        name: 'Axes',
        show: false,
        options: {
          lineType: 'full',
        },
      },
    ],
  },
  {
    mergeDefaults: true,
  },
);
const wsServer = computed(() => {
  return `ws://${rvizOptions.value.connectOptions.server}:${rvizOptions.value.connectOptions.port}`;
});

const switchCameraType = () => {
  cameraType.value = cameraType.value === '2D' ? '3D' : '2D';
};

const setClickTopic = (topic: Channel) => {
  clickTopic.value = topic;
};

const startClickPose = () => {
  if (clickTopic.value === undefined) {
    alert('请先选择一个主题');
  } else {
    if (viewerRef.value) {
      const split = clickTopic.value.schemaName.split('/');
      const type = split[split.length - 1];
      if (type === 'PointStamped') {
        viewerRef.value.startClick('point');
      } else {
        viewerRef.value.startClick('pose');
      }
    }
  }
};

const setFixedFrames = (data: string[]) => {
  fixedFrames.value = data;
};

const setTFTree = (data: TFTreeNode[]) => {
  tfTree.value = data;
};

const setSupportViewTopics = (data: Record<string, Channel>) => {
  topics.value = data;
  clickTopics.value = [];
  for (const item of Object.values(data)) {
    const split = item.schemaName.split('/');
    const type = split[split.length - 1];
    const defaultOptions = getDefaultOptions(type);
    if (type === 'PointStamped') {
      clickTopics.value.push(item);
    } else if (type === 'PoseStamped') {
      clickTopics.value.push(item);
    } else if (type === 'PoseWithCovarianceStamped') {
      clickTopics.value.push(item);
    }
    const index = rvizOptions.value.items.findIndex(
      (v) => v.name === item.topic,
    );
    if (index === -1) {
      rvizOptions.value.items.push({
        name: item.topic,
        options: {
          topic: item.topic,
          ...defaultOptions,
        },
        show: false,
        type,
      });
    }
  }
};

/**
 * 生成明亮饱和的随机颜色
 */
const getRandomVibrantHexColor = (): string => {
  const r = Math.floor(Math.random() * 256); // 红色通道
  const g = Math.floor(Math.random() * 256); // 绿色通道
  const b = Math.floor(Math.random() * 256); // 蓝色通道

  // 让颜色更加明亮和饱和
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max < 200 || max - min < 50) {
    return getRandomVibrantHexColor(); // 递归调用直到颜色明亮且饱和
  }

  // 将每个通道的值转换为两位的十六进制字符串
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const getDefaultOptions = (type: string) => {
  if (type === 'Marker') {
    return {};
  } else if (type === 'MarkerArray') {
    return {};
  } else if (type === 'Image') {
    return {
      renderDom: imageRef.value,
    };
  } else if (type === 'LaserScan') {
    return {
      color: '#FF0000',
      size: 1,
    };
  } else if (type === 'PointCloud2') {
    return {
      size: 1,
      decayTime: 0,
      max_point_count: 0,
      colorType: 'FlatColor',
      color: '#FF0000',
    };
  } else if (type === 'OccupancyGrid') {
    return {
      type: 'map',
      opacity: 0.7,
    };
  } else if (type === 'Path') {
    return {
      color: getRandomVibrantHexColor(),
      offsetZ: 0.1,
      linewidth: 2,
    };
  } else if (type === 'PointStamped') {
    return {
      color: getRandomVibrantHexColor(),
      offsetZ: 0,
      radius: 0.2,
    };
  } else if (type === 'PolygonStamped') {
    return {
      color: getRandomVibrantHexColor(),
    };
  } else if (type === 'PoseStamped') {
    return {
      color: getRandomVibrantHexColor(),
    };
  } else if (type === 'PoseArray') {
    return {
      color: getRandomVibrantHexColor(),
      length: 1.0,
    };
  } else if (type === 'PoseWithCovarianceStamped') {
    return {
      color: getRandomVibrantHexColor(),
    };
  } else if (type === 'Octomap') {
    return {
      opacity: 1.0,
      colorMode: 'zAxisColor',
      voxelRenderMode: 'occupied',
    };
  }
};
</script>

<style lang="less" scoped>
.main-viewer {
  width: 100%;
  height: 100%;
}

.main-viewer :deep(.arco-layout) {
  width: 100%;
  height: 100%;
}

.sider-content {
  height: 100%;
  overflow-y: auto;
  user-select: none;
}

.sider-content :deep(.arco-collapse-item-header-title) {
  word-wrap: break-word;
  flex-wrap: wrap;
  width: 260px;
}

.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
}

.click-topic.active {
  background: aqua;
}

.image {
  position: absolute;
  top: 80px;
  right: 10px;
  display: flex;
  width: 320px;

  :deep(video) {
    width: 100%;
    aspect-ratio: auto;
    object-fit: cover;
    margin-top: 10px;
    flex: 1;
  }

  :deep(video):first-child {
    margin-top: 0;
  }
}
</style>
