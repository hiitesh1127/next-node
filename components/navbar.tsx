import Link from 'next/link'
const Navbar = () => {
    return (
    <nav className='py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0'>
        <ul className='inline-grid grid-cols-4 gap-4'>
          <Link href="/">HOME</Link>
          <Link href="/about"><a>ABOUT</a></Link>
          <Link href="/login"><a>LOGIN</a></Link>
          <Link href="/signup"><a>SIGNUP</a></Link>
        </ul>
    </nav>
    )
}

export default Navbar
