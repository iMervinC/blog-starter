import Head from 'next/head'
import Link from 'next/link'
import { getAllPosts } from '../lib/data'
import { format, parseISO } from 'date-fns'

export default function Home({ blogPosts }) {
  return (
    <div>
      <Head>
        <title>My Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-2">
        {blogPosts?.map((blog, index) => (
          <ListBlogs key={index} {...blog} />
        ))}
      </main>
    </div>
  )
}

const ListBlogs = ({ slug, title, content, date }) => {
  return (
    <div className="card">
      <Link href={`/blog/${slug}`}>
        <a>
          <h3 className="text-lg font-bold">{title}</h3>
        </a>
      </Link>
      <span className="text-sm text-gray-600">
        {format(parseISO(date), 'MMMM do, uuu')}
      </span>
      <p>{content}</p>
    </div>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts()
  const blogPosts = allPosts.map((blog) => ({
    slug: blog.slug,
    title: blog.data.title,
    content: blog.content,
    date: blog.data.date.toISOString(),
  }))

  return {
    props: { blogPosts }, // will be passed to the page component as props
  }
}
