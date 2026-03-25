import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const createHtmlDocument = (html: string) => new DOMParser().parseFromString(html, 'text/html');

export const renderMarkdownHtml = (markdown: string) =>
  renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
      },
      markdown,
    ),
  );

export const renderMarkdownText = (markdown: string) => {
  if (!markdown.trim()) {
    return '';
  }

  const html = renderMarkdownHtml(markdown);
  const document = createHtmlDocument(html);

  return (document.body.textContent ?? '').replaceAll('\u00a0', ' ');
};

export const normalizeComparableText = (value: string) =>
  value.replaceAll('\u00a0', ' ').replace(/\s+/g, ' ').trim().toLowerCase();

export const quoteExportText = (value: string) =>
  value.replace(/\s+/g, ' ').trim().replaceAll('"', '\\"');
