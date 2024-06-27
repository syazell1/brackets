'use client'

import { useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authStore } from '@/providers/AuthStore';
import FeaturedPostMenu from './FeaturedPostMenu';

const PostMenu = () => {
  const { isLoggedIn } = authStore(); 

  return (
    <header className='flex justify-between items-center'>
      <ul className="flex gap-2 items-center text-md font-semibold">
        <li>
          <Button variant="ghost">Featured Posts</Button>
        </li>
        <li>
          <Button variant="ghost">All Posts</Button>
        </li>
        <li>
          <Button variant="ghost">Followers Posts</Button>
        </li>
      </ul>
      <FeaturedPostMenu />
    </header>
  )
}

export default PostMenu;
