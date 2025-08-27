import GridOptions from './GridOptions.vue';
import AxesOptions from './AxesOptions.vue';
import TFOptions from './TFOptions.vue';
import MarkerOptions from './MarkerOptions.vue';
import MarkerArrayOptions from './MarkerArrayOptions.vue';
import ImageOptions from './ImageOptions.vue';
import PointCloud2Options from './PointCloud2Options.vue';
import OccupancyGridOptions from './OccupancyGridOptions.vue';
import PathOptions from './PathOptions.vue';
import PointStampedOptions from './PointStampedOptions.vue';
import PolygonStampedOptions from './PolygonStampedOptions.vue';
import PoseStampedOptions from './PoseStampedOptions.vue';
import PoseArrayOptions from './PoseArrayOptions.vue';
import PoseWithCovarianceStampedOptions from './PoseWithCovarianceStampedOptions.vue';
import URDFOptions from './URDFOptions.vue';
import LaserScanOptions from './LaserScanOptions.vue';
import OctomapOptions from './OctomapOptions.vue';

export const OptionComponents = {
  Grid: GridOptions,
  Axes: AxesOptions,
  TF: TFOptions,
  URDF: URDFOptions,
  Marker: MarkerOptions,
  MarkerArray: MarkerArrayOptions,
  Image: ImageOptions,
  LaserScan: LaserScanOptions,
  PointCloud2: PointCloud2Options,
  OccupancyGrid: OccupancyGridOptions,
  Path: PathOptions,
  PointStamped: PointStampedOptions,
  PolygonStamped: PolygonStampedOptions,
  PoseStamped: PoseStampedOptions,
  PoseArray: PoseArrayOptions,
  PoseWithCovarianceStamped: PoseWithCovarianceStampedOptions,
  Octomap: OctomapOptions,
};
