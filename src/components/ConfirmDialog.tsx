import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onConfirm,
                                                         title,
                                                         message,
                                                     }) => {
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            cancelRef.current?.focus();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        ref={cancelRef}
                        onClick={onClose}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="destructive">
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;

