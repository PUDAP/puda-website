import React from 'react';
import { tinaField, useTina } from "tinacms/dist/react";
import type { NewsQuery, NewsQueryVariables } from '../__generated__/types';
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import FormattedDate from '../../src/components/react/FormattedDate.tsx';
import VideoEmbed from '../../src/components/react/VideoEmbed.tsx';
import Image from '../../src/components/react/Image.tsx';

type Props = {
	variables: NewsQueryVariables;
	data: NewsQuery;
	query: string;
}

export default function AdminNewsPost(props: Props) {

	const { data } = useTina({
		query: props.query,
		variables: props.variables,
		data: props.data,
	})

	const news = data.news;
	const isExternal = news.link?.startsWith("http");

	return (
		<article className="post">
			<header className="post-header">
				<h1 className="post-title" data-tina-field={tinaField(news, "title")}>
					{news.title}
				</h1>
				<div className="post-meta">
					{news.category && (
						<span data-tina-field={tinaField(news, "category")}>{news.category}</span>
					)}
					<span data-tina-field={tinaField(news, "pubDate")}>
						{news.pubDate && <FormattedDate date={news.pubDate} />}
					</span>
				</div>
			</header>

			<div data-tina-field={tinaField(news, "heroImage")} className="post-hero-image">
				{news.heroImage && <img width={1020} height={510} src={news.heroImage} alt="" />}
			</div>

			<div className="post-body" data-tina-field={tinaField(news, "body")}>
				<TinaMarkdown
					content={news.body}
					components={{
						VideoEmbed: VideoEmbed as (props: object) => React.JSX.Element,
						Image: Image as (props: object) => React.JSX.Element,
					}}
				/>
				{news.link && (
					<p data-tina-field={tinaField(news, "link")}>
						<a
							href={news.link}
							target={isExternal ? "_blank" : undefined}
							rel={isExternal ? "noopener noreferrer" : undefined}
						>
							{news.linkLabel || "Read more"} {isExternal ? "↗" : "→"}
						</a>
					</p>
				)}
				<p>
					<a href="/news">&larr; All news</a>
				</p>
			</div>
		</article>
	);
}
