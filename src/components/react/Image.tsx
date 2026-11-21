import React from 'react';

type Props = {
  src: string;
  alt?: string;
  caption?: string;
  [key: string]: unknown;
};

// Photographs and exported figures break out wider than the reading column;
// small vector diagrams stay inside it. Styles live in src/styles/blog.css.
export default function Image({ src, alt, caption }: Props) {
  const isVector = /\.svg($|[?#])/i.test(src ?? '');

  return (
    <figure className={isVector ? 'post-figure' : 'post-figure post-figure--wide'}>
      <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
