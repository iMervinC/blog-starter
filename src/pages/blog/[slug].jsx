import Head from 'next/head'
import { getAllPosts } from '../../lib/data'
import { format, parseISO } from 'date-fns'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'

const BlogPage = ({ title, date, content }) => {
  const mdx = hydrate(content)
  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="border-b border-gray-500 mb-4">
          <h1 className="font-bold text-2xl">{title}</h1>
          <span className="text-gray-600 text-sm">
            {format(parseISO(date), 'MMMM do, uuu')}
          </span>
        </div>
        <article className="prose prose-lg max-w-none">{mdx}</article>
      </main>
    </div>
  )
}

export default BlogPage

export async function getStaticPaths() {
  const allPosts = getAllPosts()

  return {
    paths: allPosts.map((blog) => ({
      params: { slug: blog.slug },
    })),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { params } = context

  const allPosts = getAllPosts()
  const { data, content } = allPosts.find((blog) => blog.slug === params.slug)

  const mdxSource = await renderToString(content)
  return {
    props: {
      ...data,
      date: data.date.toISOString(),
      content: mdxSource,
    }, // will be passed to the page component as props
  }
}
