import Head from 'next/head'
import { getAllPosts } from '../../lib/data'
import { format, parseISO } from 'date-fns'

const BlogPage = ({ title, date, content }) => {
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
        <p>{content}</p>
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
  return {
    props: {
      ...data,
      date: data.date.toISOString(),
      content,
    }, // will be passed to the page component as props
  }
}
