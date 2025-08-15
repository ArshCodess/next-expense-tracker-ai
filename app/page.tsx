import Guest from '@/components/Guest';
import { checkUser } from '@/lib/checkUser';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

async function Homepage() {
  const user = await currentUser();
  if (!user) {
    return <Guest/>
  }
  
  return (
    <div>Home page</div>
  )
}

export default Homepage