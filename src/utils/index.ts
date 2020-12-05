export enum NUMBER_ENUM {
  unit8 = 'unit8',
  unit16 = 'unit16',
  unit32 = 'unit32',
  float32 = 'float32',
  float64 = 'float64'
}
const NUMBER_SIZE_MAP = {
  unit8: 1,
  unit16: 2,
  unit32: 4,
  float32: 4,
  float64: 8
};
const NUMBER_TYPE_MAP = {
  unit8: Uint8Array,
  unit16: Uint16Array,
  unit32: Uint32Array,
  float32: Float32Array,
  float64: Float64Array
};
export async function initGPU() {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();
  return device;
}
export function writeBuffer({
  device,
  array,
  size = NUMBER_ENUM.unit8,
  descriptor
}: {
  device: GPUDevice;
  array: number[];
  size?: NUMBER_ENUM;
  descriptor?: Partial<GPUBufferDescriptor>;
}) {
  const gpuBuffer = device.createBuffer({
    mappedAtCreation: true,
    size: array.length * NUMBER_SIZE_MAP[size],
    usage: GPUBufferUsage.MAP_READ,
    ...descriptor
  });
  // Uncaught DOMException: Failed to execute 'getMappedRange' on 'GPUBuffer': getMappedRange failed
  const arrayBuffer = gpuBuffer.getMappedRange();
  new NUMBER_TYPE_MAP[size](arrayBuffer).set(array);
  gpuBuffer.unmap();
  return gpuBuffer;
}
