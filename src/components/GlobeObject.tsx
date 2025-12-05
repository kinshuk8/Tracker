import React, { forwardRef, useMemo } from "react";
import ThreeGlobe from "three-globe";

export const GlobeObject = forwardRef(function GlobeObject(props, ref) {
  const globe = useMemo(() => new ThreeGlobe(), []);
  return <primitive ref={ref} object={globe} {...props} />;
});
