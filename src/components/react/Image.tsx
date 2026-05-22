import React from 'react';

type Props = {
  src: string;
  alt?: string;
  caption?: string;
  [key: string]: unknown;
};

export default function Image({ src, alt, caption }: Props) {
  return (
    <figure style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.25em 0' }}>
      <img src={src} alt={alt ?? ''} style={{ width: '100%' }} />
      {caption && (
        <figcaption style={{ marginTop: '0.4rem', fontSize: '0.875em', fontStyle: 'italic', color: 'var(--fg-secondary)', alignSelf: 'flex-start', paddingLeft: '0.5rem' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
