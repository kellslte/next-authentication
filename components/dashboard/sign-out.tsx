"use client"
import React from 'react'
import { DropdownMenuItem, DropdownMenuShortcut } from '../ui/dropdown-menu';
import { signOut } from 'next-auth/react';

const SignOut = () => {
  return (
    <DropdownMenuItem onClick={() => signOut()} className='cursor-pointer'>
      Log out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}

export default SignOut