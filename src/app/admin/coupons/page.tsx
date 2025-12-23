"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CouponsTable } from "./components/CouponsTable";
import { CreateCouponDialog } from "./components/CreateCouponDialog";
import { toast } from "sonner";

export interface Coupon {
  id: number;
  code: string;
  discountAmount: number;
  isActive: boolean;
  createdAt: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      } else {
        toast.error("Failed to fetch coupons");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-gray-100">Coupons</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage discount coupons for courses.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Coupon
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading coupons...</div>
        ) : (
          <CouponsTable coupons={coupons} onUpdate={fetchCoupons} />
        )}
      </div>

      <CreateCouponDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSuccess={fetchCoupons} 
      />
    </div>
  );
}
