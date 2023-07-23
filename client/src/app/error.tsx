'use client' // Error components must be Client Components

import Container from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import NavBar from '@/components/ui/nav-bar'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <>
            <NavBar />
            <Container className="pt-[75px]">
                <div className="flex flex-col gap-2">
                    <h2>Something went wrong!</h2>
                    <Button
                        onClick={
                            // Attempt to recover by trying to re-render the segment
                            () => reset()
                        }
                    >
                        Try again
                    </Button>
                </div>
            </Container>
        </>
    )
}