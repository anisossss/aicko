import { useState } from 'react';
import { InView } from 'react-intersection-observer';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  placeholder?: React.ReactNode;
}

const LazyLoadWrapper = ({
  children,
  rootMargin = '200px 0px',
  threshold = 0.01,
  placeholder = <div className="h-full w-full bg-muted animate-pulse" />,
}: LazyLoadWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InView
      triggerOnce
      rootMargin={rootMargin}
      threshold={threshold}
      onChange={(inView) => inView && !isVisible && setIsVisible(true)}
    >
      {({ inView, ref }) => (
        <div ref={ref} className="w-full h-full">
          {isVisible ? children : placeholder}
        </div>
      )}
    </InView>
  );
};

export default LazyLoadWrapper;