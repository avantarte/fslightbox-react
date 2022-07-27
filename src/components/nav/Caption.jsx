import { PREFIX } from "../../constants/classes-names";
import React from "react";

const Caption = ({
  fsLightbox: {
    props: { captions },
  },
  stageIndex,
}) => {
  const caption = captions[stageIndex];
  return (
    <div title={`${PREFIX}caption`} className={`${PREFIX}caption`}>
      <div>{caption}</div>
    </div>
  );
};

export default Caption;
