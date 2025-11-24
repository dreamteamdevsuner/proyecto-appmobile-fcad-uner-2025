import sanitizeHtml from 'sanitize-html';

const sanitizeText = (text: string) => {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

export default sanitizeText;
