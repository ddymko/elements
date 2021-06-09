import { JsonSchemaViewer } from '@stoplight/json-schema-viewer';
import { Heading, HStack } from '@stoplight/mosaic';
import { withErrorBoundary } from '@stoplight/react-error-boundary';
import cn from 'classnames';
import { JSONSchema7 } from 'json-schema';
import * as React from 'react';

import { useInlineRefResolver, useResolvedObject } from '../../../context/InlineRefResolver';
import { getOriginalObject } from '../../../utils/ref-resolving/resolvedObject';
import { MarkdownViewer } from '../../MarkdownViewer';
import { DocsComponentProps } from '..';
import { InternalBadge } from '../HttpOperation/Badges';

export type ModelProps = DocsComponentProps<JSONSchema7>;

const ModelComponent: React.FC<ModelProps> = ({ data: unresolvedData, className, headless, nodeTitle }) => {
  const resolveRef = useInlineRefResolver();
  const data = useResolvedObject(unresolvedData) as JSONSchema7;

  const title = data.title ?? nodeTitle;
  const isInternal = !!data['x-internal'];

  return (
    <div className={cn('Model', className)}>
      {!headless && title !== undefined && (
        <Heading size={1} mb={4} fontWeight="semibold">
          {title}
        </Heading>
      )}

      {isInternal && (
        <HStack spacing={2} mt={3} mb={12}>
          <InternalBadge />
        </HStack>
      )}

      {data.description && <MarkdownViewer markdown={data.description} />}

      <JsonSchemaViewer resolveRef={resolveRef} className={className} schema={getOriginalObject(data)} />
    </div>
  );
};

export const Model = withErrorBoundary<ModelProps>(ModelComponent, { recoverableProps: ['data'] });
