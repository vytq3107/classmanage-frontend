'use client'

import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@/components/ui/menubar'

export default function MenuBar({ activeTab, onTabChange }) {
  return (
    <Menubar className="bg-white">
      <MenubarMenu>
        <MenubarTrigger>Menu</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => onTabChange('student')}>Student</MenubarItem>
          <MenubarItem onClick={() => onTabChange('lesson')}>Lesson</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
