import { SKELETON_ITEMS_COUNT } from '@/constants';

const SkeletonList = () => (
  <div className="w-full space-y-2" role="status" aria-label="Loading tasks">
    {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, i) => (
      <div
        key={i}
        className="h-16 bg-surface-600 animate-pulse rounded-md"
        aria-hidden="true"
      />
    ))}
  </div>
);

export default SkeletonList;
