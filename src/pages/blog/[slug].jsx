import Head from 'next/head'
import { blogPosts } from '../../lib/data'

const BlogPage = ({ title, date, content }) => {
  return (
    <div>
      <Head>
        <title>My Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{title}</h1>
      </main>
      <span>{date}</span>
      <p>{content}</p>
    </div>
  )
}

export default BlogPage

export async function getStaticPaths() {
  return {
    paths: blogPosts.map((blog) => ({
      params: { slug: blog.slug },
    })),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { params } = context
  return {
    props: blogPosts.find((blog) => blog.slug === params.slug), // will be passed to the page component as props
  }
}
