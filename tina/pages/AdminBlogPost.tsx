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
					<div style={{
						background: "var(--blog-bg)",
						border: "1px solid var(--blog-border)",
						padding: "2rem 2rem",
						marginBottom: "2rem",
					}}>
						<h1
							data-tina-field={tinaField(blog, "title")}
							style={{
								fontSize: "clamp(2rem, 5vw, 3.5rem)",
								fontWeight: 700,
								lineHeight: 1.1,
								margin: "0 0 2rem 0",
							}}
						>
							{blog.title}
						</h1>
						<div style={{
							display: "grid",
							gridTemplateColumns: "max-content 1fr",
							gap: "0.25rem 2rem",
							fontSize: "0.85rem",
						}}>
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
					<TinaMarkdown content={blog.body} components={{ VideoEmbed: VideoEmbed as (props: object) => React.JSX.Element, Image: Image as (props: object) => React.JSX.Element }} />
				</div>
			</div>
		</article>
	);
}
