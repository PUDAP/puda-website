import React from 'react';
import { tinaField, useTina } from "tinacms/dist/react";
import type { BlogQuery, BlogQueryVariables } from '../__generated__/types';
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import FormattedDate from '../../src/components/react/FormattedDate.tsx';
import VideoEmbed from '../../src/components/react/VideoEmbed.tsx';
import Image from '../../src/components/react/Image.tsx';


type Props = {
	variables: BlogQueryVariables;
	data: BlogQuery;
	query: string;
}

export default function AdminBlogPost(props: Props) {

	const { data } = useTina({
		query: props.query,
		variables: props.variables,
		data: props.data,
	})

	const blog = data.blog;

	return (
		<article>
			<div data-tina-field={tinaField(blog, "heroImage")} className="hero-image">
				{blog.heroImage && <img width={1020} height={510} src={blog.heroImage} alt="" />}
			</div>
			<div className="prose">
				<div className="title">
					<div className="post-hero">
						<h1
							data-tina-field={tinaField(blog, "title")}
							style={{
								fontSize: "clamp(1.75rem, 8vw, 3.5rem)",
								fontWeight: 700,
								lineHeight: 1.1,
								margin: "0 0 2rem 0",
							}}
						>
							{blog.title}
						</h1>
						<div className="post-hero-meta">
							<span style={{ color: "var(--fg-secondary)" }}>Published</span>
							<span data-tina-field={tinaField(blog, "pubDate")} style={{ color: "var(--fg-primary)" }}>
								{blog.pubDate && <FormattedDate date={blog.pubDate} />}
							</span>
							{blog.email && (
								<>
									<span style={{ color: "var(--fg-secondary)" }}>Email</span>
									<span data-tina-field={tinaField(blog, "email")} style={{ color: "var(--fg-primary)" }}>
										{blog.email}
									</span>
								</>
							)}
						</div>
					</div>
				</div>
				<div data-tina-field={tinaField(blog, "body")}>
					<TinaMarkdown
						content={blog.body}
						components={{
							VideoEmbed: VideoEmbed as (props: object) => React.JSX.Element,
							Image: Image as (props: object) => React.JSX.Element,
							// Preserve inline HTML (e.g. <span id="ref-1" />) so citation anchors work
							html_inline: ({ value }: { value?: string }) => (
								<span dangerouslySetInnerHTML={{ __html: value ?? "" }} />
							),
							html: ({ value }: { value?: string }) => (
								<div dangerouslySetInnerHTML={{ __html: value ?? "" }} />
							),
						}}
					/>
				</div>
			</div>
		</article>
	);
}
