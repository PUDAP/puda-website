import React from 'react';
import { tinaField, useTina } from "tinacms/dist/react";
import type { BlogQuery, BlogQueryVariables } from '../__generated__/types';
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import FormattedDate from '../../src/components/react/FormattedDate.tsx';
import VideoEmbed from '../../src/components/react/VideoEmbed.tsx';
import Image from '../../src/components/react/Image.tsx';
import { CodeBlock } from '../../src/components/react/code-block/code-block.tsx';
import { FileStructure } from '../../src/components/react/file-structure.tsx';


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
		<article className="post">
			<header className="post-header">
				<h1 className="post-title" data-tina-field={tinaField(blog, "title")}>
					{blog.title}
				</h1>
				<div className="post-meta">
					<span data-tina-field={tinaField(blog, "email")}>
						{blog.email || "PUDA"}
					</span>
					<span data-tina-field={tinaField(blog, "pubDate")}>
						{blog.pubDate && <FormattedDate date={blog.pubDate} />}
					</span>
				</div>
			</header>

			<div data-tina-field={tinaField(blog, "heroImage")} className="post-hero-image">
				{blog.heroImage && <img width={1020} height={510} src={blog.heroImage} alt="" />}
			</div>

			<div className="post-body" data-tina-field={tinaField(blog, "body")}>
				<TinaMarkdown
					content={blog.body}
					components={{
						VideoEmbed: VideoEmbed as (props: object) => React.JSX.Element,
						Image: Image as (props: object) => React.JSX.Element,
						code_block: CodeBlock as (props: object) => React.JSX.Element,
						fileStructure: FileStructure as (props: object) => React.JSX.Element,
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
		</article>
	);
}
