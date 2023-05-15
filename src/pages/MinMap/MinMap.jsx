import React, { useEffect } from 'react';
import { Card } from 'antd';
import 'jsmind/style/jsmind.css';
import * as jsMind from 'jsmind';

const MindMap = () => {
  useEffect(() => {
    const mindInstance = jsMind.show('map_container');
    // Load or set your mind map data
    const data = {
      /* your mind map data */
    };
    mindInstance.show(data);
  }, []);

  return (
    <Card>
      <div id="map_container" style={{ height: '500px' }}>
        11
      </div>
    </Card>
  );
};

export default MindMap;
