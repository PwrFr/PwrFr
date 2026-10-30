import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    // DialogTrigger,
} from '@/components/ui/dialog';

import {
    Table,
    TableBody,
    // TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    // DropdownMenuLabel,
    // DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    // AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { EllipsisVertical } from 'lucide-react';

export const TablePage = () => {
    const [open, setOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    interface Row {
        id: number;
        name: string;
    }

    const rows: Row[] = [
        { id: 1, name: 'Row 1' },
        { id: 2, name: 'Row 2' },
        { id: 3, name: 'Row 3' },
    ];

    return (
        <div className='max-w-[1280px] mx-auto mt-28'>
            <div className='grid gap-4'>
                <div className='flex justify-between items-center'>
                    <h1 className='font-medium text-4xl'>Table</h1>
                    <Button onClick={() => setOpen(true)}>Open</Button>
                </div>

                <div>
                    <Table>
                        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-[100px]'>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className='text-right'></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className='font-medium'>
                                        {item.id}
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>Credit Card</TableCell>
                                    <TableCell className='text-right'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant='ghost'
                                                    size={'icon'}
                                                >
                                                    <EllipsisVertical
                                                        height={90}
                                                        width={90}
                                                    />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setOpen(true)
                                                    }
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    variant='destructive'
                                                    onClick={() =>
                                                        setIsDelete(true)
                                                    }
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <AlertDialog open={isDelete} onOpenChange={setIsDelete}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};
