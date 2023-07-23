import Container from '@/components/layout/Container'
import NavBar from '@/components/ui/nav-bar'
import Link from 'next/link'

export default function NotFound() {
    return (

        <>
            <NavBar />
            <Container className="pt-[75px]">
                <div className="flex flex-col gap-2">
                    <h2 className='text-center text-2xl font-semibold'>Not Found</h2>
                    <p className='text-center'>Could not find requested resource</p>
                    <p className='text-center'>
                        View <Link className='hover:underline' href="/">all posts</Link>
                    </p>
                </div>
            </Container>
        </>
    )
}