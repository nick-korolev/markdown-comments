import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true,
});

const createHtmlDocument = (html: string) => new DOMParser().parseFromString(html, 'text/html');

export const renderMarkdownHtml = (markdown: string) =>
  DOMPurify.sanitize(marked.parse(markdown) as string);

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
