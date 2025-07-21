'use client'

import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Plus,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import AddStudentForm from '../Button/AddStudentForm'
import DashboardAlert from '../Notification/DashboardAlert'
import ConfirmDialog from '../Notification/ConfirmDialog'
import { useDashboard } from '@/features/dashboard/useDashboard'

export default function StudentInfo() {
  const {
    students,
    loading,
    error,
    alert,
    deleteStudent,
    addStudent,
    editStudent,
  } = useDashboard()

  const [globalFilter, setGlobalFilter] = React.useState('')
  const [editingStudent, setEditingStudent] = React.useState(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(null)

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-blue-600"
          >
            Name <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue('email')}</div>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <div>{row.getValue('phone')}</div>,
      },
      {
        header: 'Actived',
        cell: ({ row }) => {
          const student = row.original
          const isActive = student.setupCompleted === true
          return isActive ? (
            <CheckCircle className="text-green-600" />
          ) : (
            <XCircle className="text-red-500" />
          )
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const student = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(student.id)}
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setEditingStudent(student)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setConfirmDelete(student)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [deleteStudent]
  )

  const table = useReactTable({
    data: students,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full max-w-[66%]">
      <DashboardAlert alert={alert} />

      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter name..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-blue-600 border-blue-600"
                >
                  <Plus />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add student</p>
            </TooltipContent>
          </Tooltip>

          <DialogContent className="sm:max-w-[500px] min-h-[400px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <AddStudentForm
              addStudent={addStudent}
              onClose={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* EDIT STUDENT  DIALOG */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[500px] min-h-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <AddStudentForm
              mode="edit"
              initialData={editingStudent}
              onClose={() => setEditingStudent(null)}
              editStudent={editStudent}
              addStudent={addStudent}
              deleteStudent={deleteStudent}
            />
          )}
        </DialogContent>
      </Dialog>

      {confirmDelete && (
        <ConfirmDialog
          open={!!confirmDelete}
          onOpenChange={(open) => {
            if (!open) setConfirmDelete(null)
          }}
          title="Are you sure you want to delete this student?"
          description={`"${confirmDelete.name}" will be permanently removed from the system.`}
          cancelText="Cancel"
          confirmText="Delete"
          onConfirm={() => {
            deleteStudent(confirmDelete.phone)
            setConfirmDelete(null)
          }}
        />
      )}

      <div className="rounded-md border min-h-[200px]">
        {loading ? (
          <div className="p-4 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500"> {error}</div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
