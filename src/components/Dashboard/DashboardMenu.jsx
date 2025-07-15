'use client'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'

export default function DashboardMenu({ onTabChange }) {
  return (
    <Menubar className="flex space-x-6">
      <MenubarMenu>
        <MenubarTrigger>Manage</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => onTabChange('student')}>
            Manage Student
          </MenubarItem>
          <MenubarItem onClick={() => onTabChange('lesson')}>
            Manage Lesson
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
