import Head from 'next/head'
import Link from 'next/link'
import { blogPosts } from '../lib/data'

export default function Home() {
  return (
    <div>
      <Head>
        <title>My Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Hello My Blog</h1>
      </main>
      <div>
        {blogPosts?.map((blog, index) => (
          <div key={index}>
            <Link href={`/blog/${blog.slug}`}>
              <a>
                <h3>{blog.title}</h3>
              </a>
            </Link>
            <span>{blog.date.toString()}</span>
            <p>{blog.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
