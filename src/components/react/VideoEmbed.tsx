import React from 'react';

type Props = {
  url: string;
  caption?: string;
  [key: string]: unknown;
};

export default function VideoEmbed({ url, caption }: Props) {
  return (
    <figure style={{ margin: '2rem 0' }}>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
        <iframe
          src={url}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          allow="autoplay"
          allowFullScreen
        />
      </div>
      {caption && (
        <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9em', color: 'var(--gray)' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
