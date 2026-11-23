import React from 'react';

type Props = {
  url: string;
  caption?: string;
  [key: string]: unknown;
};

// Styles live in src/styles/blog.css.
export default function VideoEmbed({ url, caption }: Props) {
  return (
    <figure className="post-figure post-figure--wide">
      <div className="post-video">
        <iframe src={url} loading="lazy" allow="autoplay" allowFullScreen />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
