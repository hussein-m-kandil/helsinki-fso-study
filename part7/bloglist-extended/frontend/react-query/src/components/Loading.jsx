import { Spinner } from '@heroui/react';

const Loading = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Spinner
      classNames={{ label: 'text-foreground mt-4' }}
      label="Loading..."
    />
  </div>
);

export default Loading;
