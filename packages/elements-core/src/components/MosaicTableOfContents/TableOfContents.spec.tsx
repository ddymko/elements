import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import * as React from 'react';

import { withMosaicProvider } from '../../hoc/withMosaicProvider';
import { TableOfContents as TOC } from './TableOfContents';

const TableOfContents = withMosaicProvider(TOC);

const Link: React.FC = ({ children }) => <>{children}</>;

describe('TableOfContents', () => {
  describe('Group', () => {
    it('should only render group contents when open', () => {
      const { unmount } = render(
        <TableOfContents
          activeId=""
          tree={[
            {
              title: 'Root',
              items: [
                {
                  id: 'targetId',
                  title: 'Target',
                  slug: 'target',
                  type: 'article',
                  meta: '',
                },
              ],
            },
          ]}
          Link={Link}
        />,
      );

      expect(screen.queryByTitle('Root')).toBeInTheDocument();
      expect(screen.queryByTitle('Target')).not.toBeInTheDocument();

      unmount();
    });

    it('it renders group contents if maxDepthOpenByDefault > 0', () => {
      const { unmount } = render(
        <TableOfContents
          activeId=""
          tree={[
            {
              title: 'Root',
              items: [
                {
                  id: 'targetId',
                  title: 'Target',
                  slug: 'target',
                  type: 'article',
                  meta: '',
                },
              ],
            },
          ]}
          Link={Link}
          maxDepthOpenByDefault={1}
        />,
      );

      expect(screen.queryByTitle('Root')).toBeInTheDocument();
      expect(screen.queryByTitle('Target')).toBeInTheDocument();

      unmount();
    });

    it('should default open when nested child is active', () => {
      const { unmount } = render(
        <TableOfContents
          activeId="targetId"
          tree={[
            {
              title: 'Root',
              items: [
                {
                  title: 'Group',
                  items: [
                    {
                      id: 'targetId',
                      title: 'Target',
                      slug: 'target',
                      type: 'article',
                      meta: '',
                    },
                  ],
                },
              ],
            },
          ]}
          Link={Link}
        />,
      );

      expect(screen.queryByTitle(/Root/)).toBeInTheDocument();
      expect(screen.queryByTitle(/Group/)).toBeInTheDocument();
      expect(screen.queryByTitle(/Target/)).toBeInTheDocument();

      unmount();
    });

    it('should close an opened group on click', () => {
      const { unmount } = render(
        <TableOfContents
          activeId="targetId"
          tree={[
            {
              title: 'Root',
              items: [
                {
                  id: 'targetId',
                  title: 'Target',
                  slug: 'target',
                  type: 'article',
                  meta: '',
                },
              ],
            },
          ]}
          Link={Link}
        />,
      );

      const Root = screen.queryByTitle(/Root/);

      expect(Root).toBeInTheDocument();
      expect(screen.queryByTitle('Target')).toBeInTheDocument();

      Root?.click();

      expect(screen.queryByTitle('Target')).not.toBeInTheDocument();

      unmount();
    });

    it('should open a closed group on click', () => {
      const { unmount } = render(
        <TableOfContents
          activeId=""
          tree={[
            {
              title: 'Root',
              items: [
                {
                  id: 'targetId',
                  title: 'Target',
                  slug: 'target',
                  type: 'article',
                  meta: '',
                },
              ],
            },
          ]}
          Link={Link}
        />,
      );

      const Root = screen.queryByTitle(/Root/);

      expect(Root).toBeInTheDocument();
      expect(screen.queryByTitle(/Target/)).not.toBeInTheDocument();

      Root?.click();

      expect(screen.queryByTitle(/Target/)).toBeInTheDocument();

      unmount();
    });

    it('should display item version', () => {
      const { unmount } = render(
        <TableOfContents
          activeId=""
          maxDepthOpenByDefault={1}
          tree={[
            {
              title: 'Root',
              items: [
                {
                  id: 'abc',
                  title: 'Todo Api',
                  slug: 'abc-todo-api',
                  type: 'http_service',
                  items: [],
                  meta: '',
                  version: '2',
                },
                {
                  id: 'def',
                  title: 'Todo',
                  slug: 'def-todo',
                  type: 'model',
                  meta: '',
                  version: '1.0.1',
                },
                {
                  id: 'ghi',
                  title: 'Get Todo',
                  slug: 'ghi-get-todo',
                  type: 'http_operation',
                  meta: 'get',
                  version: '1.0.2',
                },
              ],
            },
          ]}
          Link={Link}
        />,
      );

      expect(screen.queryByText(/v2/)).toBeInTheDocument();
      expect(screen.queryByText(/v1.0.1/)).toBeInTheDocument();

      expect(screen.queryByText(/v1.0.2/)).not.toBeInTheDocument();

      unmount();
    });
  });
});
