'use client'

import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@/components/ui/menubar'
import { UserIcon, NotebookIcon } from 'lucide-react'

export default function MenuStudent({ onTabChange }) {
  return (
    <Menubar className="bg-white">
      <MenubarMenu>
        <MenubarTrigger>Menu</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => onTabChange('lesson')}>
            <NotebookIcon className="w-4 h-4 mr-2" /> Lessons
          </MenubarItem>
          <MenubarItem onClick={() => onTabChange('profile')}>
            <UserIcon className="w-4 h-4 mr-2" /> Profile
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
