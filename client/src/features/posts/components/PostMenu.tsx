'use client'

import { authContextProvider } from '@/providers/AuthContext';
import { useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PostMenu = () => {
  const { isLoggedIn } = useContext(authContextProvider);

  return (
    <header className='mt-4'>
      <ul className="flex gap-2 items-center">
        <li>All Posts</li>
        <li>Featured</li>
        <li>Rising</li>
        {isLoggedIn && (
          <div className="ml-auto">
            <Button asChild >
              <Link href="/posts/create">Add New Post</Link>
            </Button>
          </div>
        )}
      </ul>
    </header>
  )
}

export default PostMenu;
