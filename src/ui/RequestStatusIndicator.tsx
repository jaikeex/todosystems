import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Loader } from '@/ui';
import { twMerge } from 'tailwind-merge';

interface RequestStatusIndicatorProps {
  className?: string;
}

type RequestSliceState = {
  status?: 'pending';
};

const animationClasses = {
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut'
};

/**
 * Does not serve any special purpose, wanted to test something else with rtk query and ended up writing this...
 * Feels harmless so just left it in.
 */
const RequestStatusIndicator: React.FC<RequestStatusIndicatorProps> = ({
  className = ''
}) => {
  const [visible, setVisible] = useState(false);
  const [animationClassName, setAnimationClassName] = useState(
    animationClasses.fadeIn
  );
  const apiState = useAppSelector((state) => state.tasksApi);
  const startTimeRef = useRef<number | undefined>(undefined);

  const hasPendingRequests = useMemo(() => {
    if (!apiState) {
      return false;
    }

    const { queries = {}, mutations = {} } = apiState as {
      queries?: Record<string, RequestSliceState>;
      mutations?: Record<string, RequestSliceState>;
    };

    const isPending = (entry: RequestSliceState | undefined) =>
      entry?.status === 'pending';

    return (
      Object.values(queries ?? {}).some(isPending) ||
      Object.values(mutations ?? {}).some(isPending)
    );
  }, [apiState]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (hasPendingRequests) {
      startTimeRef.current = Date.now();
      setAnimationClassName(animationClasses.fadeIn);
      setVisible(true);
    } else {
      const elapsed = startTimeRef.current
        ? Date.now() - startTimeRef.current
        : 0;

      if (elapsed >= 100) {
        setAnimationClassName(animationClasses.fadeOut);
        timeout = setTimeout(() => {
          setVisible(false);
        }, 200);
      } else {
        setVisible(false);
      }

      startTimeRef.current = undefined;
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [hasPendingRequests]);

  if (!visible) return null;

  return (
    <Loader size="md" className={twMerge(className, animationClassName)} />
  );
};

export default RequestStatusIndicator;
