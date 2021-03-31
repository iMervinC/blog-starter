import Link from 'next/link'

const Navigation = () => {
  return (
    <header className="my-5">
      <h1 className="text-center text-6xl font-bold">My Blog</h1>
      <nav className="my-4">
        <ul className="flex justify-center space-x-4 text-lg font-bold">
          <li className="">
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li className="">
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export { Navigation }
