import { Box, Flex, Heading, HStack } from '@stoplight/mosaic';
import { withErrorBoundary } from '@stoplight/react-error-boundary';
import { IHttpOperation } from '@stoplight/types';
import cn from 'classnames';
import { flatten, sortBy } from 'lodash';
import * as React from 'react';

import { MockingContext } from '../../../containers/MockingProvider';
import { useResolvedObject } from '../../../context/InlineRefResolver';
import { getServiceUriFromOperation } from '../../../utils/oas/security';
import { MarkdownViewer } from '../../MarkdownViewer';
import { TryItWithRequestSamples } from '../../TryIt';
import { DocsComponentProps } from '..';
import { DeprecatedBadge, InternalBadge, SecurityBadge } from './Badges';
import { Request } from './Request';
import { Responses } from './Responses';

export type HttpOperationProps = DocsComponentProps<IHttpOperation>;

const HttpOperationComponent = React.memo<HttpOperationProps>(
  ({ className, data: unresolvedData, uri, allowRouting = false, layoutOptions }) => {
    const data = useResolvedObject(unresolvedData) as IHttpOperation;

    const mocking = React.useContext(MockingContext);
    const isDeprecated = !!data.deprecated;
    const isInternal = !!data.internal;

    const [responseMediaType, setResponseMediaType] = React.useState('');
    const [responseStatusCode, setResponseStatusCode] = React.useState('');
    const [requestBodyIndex, setTextRequestBodyIndex] = React.useState(0);

    const httpServiceUri = uri && getServiceUriFromOperation(uri);

    const securitySchemes = flatten(data.security);

    const hasBadges = isDeprecated || securitySchemes.length > 0 || isInternal;

    return (
      <Box bg="transparent" className={cn('HttpOperation', className)} w="full">
        {!layoutOptions?.noHeading && (
          <Heading size={1} fontWeight="semibold">
            {data.summary || data.iid || `${data.method} ${data.path}`}
          </Heading>
        )}

        {hasBadges && (
          <HStack spacing={2} mt={3}>
            {isDeprecated && <DeprecatedBadge />}
            {sortBy(securitySchemes, 'type').map((scheme, i) => (
              <SecurityBadge key={i} scheme={scheme} httpServiceUri={allowRouting ? httpServiceUri : undefined} />
            ))}
            {isInternal && <InternalBadge isHttpService />}
          </HStack>
        )}

        <Flex mt={12}>
          <Box flex={1}>
            {data.description && (
              <MarkdownViewer className="HttpOperation__Description sl-mb-10" markdown={data.description} />
            )}

            <Request onChange={setTextRequestBodyIndex} operation={data} />

            {data.responses && (
              <Responses
                responses={data.responses}
                onMediaTypeChange={setResponseMediaType}
                onStatusCodeChange={setResponseStatusCode}
              />
            )}
          </Box>

          {!layoutOptions?.hideTryItPanel && (
            <Box ml={16} pos="relative" w="2/5" style={{ maxWidth: 500 }}>
              <Box className="HttpOperation__gutter">
                <TryItWithRequestSamples
                  httpOperation={data}
                  responseMediaType={responseMediaType}
                  responseStatusCode={responseStatusCode}
                  requestBodyIndex={requestBodyIndex}
                  hideTryIt={layoutOptions?.hideTryIt}
                  mockUrl={mocking.hideMocking ? undefined : mocking.mockUrl}
                />
              </Box>
            </Box>
          )}
        </Flex>
      </Box>
    );
  },
);
HttpOperationComponent.displayName = 'HttpOperation.Component';

export const HttpOperation = withErrorBoundary<HttpOperationProps>(HttpOperationComponent, {
  recoverableProps: ['data'],
});
