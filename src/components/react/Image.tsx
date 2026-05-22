import React from 'react';

type Props = {
  src: string;
  alt?: string;
  caption?: string;
  [key: string]: unknown;
};

export default function Image({ src, alt, caption }: Props) {
  return (
    <figure style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}>
      <img src={src} alt={alt ?? ''} style={{ width: '100%' }} />
      {caption && (
        <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9em', color: 'var(--gray)' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
