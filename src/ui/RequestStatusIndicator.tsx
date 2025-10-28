import React, { useMemo, useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Loader } from '@/ui';
import cn from 'classnames';

interface RequestStatusIndicatorProps {
  className?: string;
}

type RequestSliceState = {
  status?: 'pending';
};

const animationClases = {
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut'
};

const RequestStatusIndicator: React.FC<RequestStatusIndicatorProps> = ({
  className = ''
}) => {
  const [visible, setVisible] = useState(false);
  const [animationClassName, setAnimationClassName] = useState(
    animationClases.fadeIn
  );
  const apiState = useAppSelector((state) => state.tasksApi);

  const hasPendingRequests = useMemo(() => {
    if (!apiState) {
      return false;
    }

    const { queries = {} } = apiState as {
      queries?: Record<string, RequestSliceState>;
    };

    const isPending = (entry: unknown) =>
      (entry as RequestSliceState | undefined)?.status === 'pending';

    return Object.values(queries ?? {}).some(isPending);
  }, [apiState]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (hasPendingRequests) {
      setAnimationClassName(animationClases.fadeIn);
      setVisible(true);
    } else {
      setAnimationClassName(animationClases.fadeOut);
      timeout = setTimeout(() => {
        setVisible(false);
      }, 200);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [hasPendingRequests]);

  if (!visible) return null;

  return <Loader size="md" className={cn(className, animationClassName)} />;
};

export default RequestStatusIndicator;
