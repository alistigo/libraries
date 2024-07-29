import React, { useState } from 'react';
import {
  Viewport,
  FloatingViewport,
  ViewportPositionTypes,
  defaultInlineViewport,
  defaultFloatingViewport,
} from '@alistigo/third-party-js-types';
import { useViewport } from '@alistigo/third-party-js-application-react';

interface ViewportPositionTemplate {
  viewport: Viewport;
  name: String;
}

const viewportTemplates: ViewportPositionTemplate[] = [
  {
    name: 'inline',
    viewport: defaultInlineViewport,
  },
  {
    name: 'floating-top-left',
    viewport: defaultFloatingViewport,
  },
  {
    name: 'floating-bottom-right',
    viewport: {
      ...defaultFloatingViewport,
      left: undefined,
      top: undefined,
      bottom: '0',
      right: '0',
    } as FloatingViewport,
  },
  {
    name: 'fullscreen',
    viewport: {
      type: ViewportPositionTypes.fullscreen,
      visible: true,
      withDebug: false,
    },
  },
];

export default function ViewportTester() {
  const [currentTemplateKey, setCurrentTemplateKey] = useState(0);
  const { updateViewport } = useViewport();

  function handleOnChangeViewport(e: React.ChangeEvent) {
    const select = e.target as HTMLSelectElement;
    const key = parseInt(select.value, 10);
    const template = viewportTemplates[key];
    setCurrentTemplateKey(key);
    updateViewport(template.viewport);
  }

  return (
    <fieldset>
      <legend>Set viewport</legend>
      <select value={currentTemplateKey} onChange={handleOnChangeViewport}>
        {viewportTemplates.map((template: ViewportPositionTemplate, key) => (
          <option key={`select-viewport-position-${template.name}`} value={key}>
            {template.name}
          </option>
        ))}
      </select>
    </fieldset>
  );
}
