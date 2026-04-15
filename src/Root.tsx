import React from 'react';
import {Composition} from 'remotion';
import {FutureTimeline} from './FutureTimeline';

export const Root: React.FC = () => {
  return (
    <Composition
      id="MyVideo"
      component={FutureTimeline}
      durationInFrames={450}
      fps={30}
      width={450}
      height={800}
    />
  );
};
