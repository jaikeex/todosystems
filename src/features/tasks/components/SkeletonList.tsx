const SkeletonList = () => (
  <div className="w-full space-y-2">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-16 bg-gray-500 animate-pulse rounded-md" />
    ))}
  </div>
);

export default SkeletonList;
