"use client";

import { Coupon } from "../page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface CouponsTableProps {
  coupons: Coupon[];
  onUpdate: () => void;
}

export function CouponsTable({ coupons, onUpdate }: CouponsTableProps) {
  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        toast.success("Coupon status updated");
        onUpdate();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const deleteCoupon = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Coupon deleted");
        onUpdate();
      } else {
        toast.error("Failed to delete coupon");
      }
    } catch (error) {
      toast.error("Error deleting coupon");
    }
  };

  if (coupons.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No coupons found. Create one to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coupons.map((coupon) => (
          <TableRow key={coupon.id}>
            <TableCell className="font-medium text-lg">{coupon.code}</TableCell>
            <TableCell>₹{coupon.discountAmount}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch
                  checked={coupon.isActive}
                  onCheckedChange={() => toggleStatus(coupon.id, coupon.isActive)}
                />
                <span className={`text-sm ${coupon.isActive ? "text-green-600" : "text-slate-500"}`}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </TableCell>
            <TableCell>{format(new Date(coupon.createdAt), "PP")}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteCoupon(coupon.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
