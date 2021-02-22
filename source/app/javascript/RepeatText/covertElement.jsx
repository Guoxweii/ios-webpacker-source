import React from 'react';
import HtmlElement from './HtmlElement';
import ItemElement from './ItemElement';
/* eslint-disable import/no-cycle */
import ContainerElement from './ContainerElement';

export default function covertElement(line, statusMapping, entryMapping, props) {
  switch (line.type) {
    case 'text':
      return line.content;
    case 'html':
      return <HtmlElement {...line} {...props} />;
    case 'item': {
      const { item } = line;
      return (
        <ItemElement
          status={statusMapping[item.position]}
          entry={entryMapping[item.position]}
          {...line}
          {...props}
        />
      );
    }
    case 'container':
      return <ContainerElement statusMapping={statusMapping} entryMapping={entryMapping} {...line} {...props} />;
    default:
      throw new Error('unsupport line type');
  }
}
