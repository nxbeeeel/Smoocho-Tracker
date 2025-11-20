/**
 * Staff Name Modal - Shows on first visit
 */
import { useState, useEffect } from 'react';
import { getStaffName, saveStaffName } from '../utils/storage';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const StaffNameModal = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!getStaffName()) {
      setShow(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      saveStaffName(name.trim());
      setShow(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Smoocho! 🍓</DialogTitle>
          <DialogDescription>Please enter your name to get started</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            required
          />
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffNameModal;
