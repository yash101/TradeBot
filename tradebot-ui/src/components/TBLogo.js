import { convertLegacyProps } from 'antd/lib/button/button';
import React from 'react';
import Logo from '../res/cover.png';

function TBLogo(props) {
  let width = 0;
  let height = 0;
  if (props.width) {
    width = props.width
    height = props.width * 1440 / 3500;
  } else {
    height = props.height
    width = props.height * 3500 / 1440;
  }

  return (
    <div
      style={{
        display: 'inline-block',
        width: width,
        height: height,
        backgroundImage: `url(${Logo})`,
        backgroundSize: 'contain',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
      }}
    ></div>
  );
}

export default TBLogo;
