"use client";

import {
  ShoppingCart,
  DollarSign,
  BriefcaseBusiness,
  CircleDollarSign,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

function CostCard({
  label,
  value,
  sub,
  icon: Icon,
  valueClass,
  iconColor = "text-red-500",
}) {
  return (
    <Card className="flex-1 min-w-[240px] rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md mt-3">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-gray-500">
            {label}
          </p>

          <p className={`text-2xl font-bold ${valueClass || "text-gray-900"}`}>
            {value}
          </p>

          {sub && (
            <p className="mt-1 text-xs text-gray-400">
              {sub}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function CostCards() {
  return (
    <div className="flex flex-wrap gap-4 p-4 sm:p-6">
      <CostCard
        label="Purchase Order Value"
        value="$0.00"
        sub="Purchase Order"
        icon={ShoppingCart}
        iconColor="text-red-500"
      />

      <CostCard
        label="Predicted Cost"
        value="$0.00"
        sub="Estimated Cost"
        icon={DollarSign}
        valueClass="text-orange-600"
        iconColor="text-red-500"
      />

      <CostCard
        label="Outsourcing Cost"
        value="$0.00"
        sub="External Resources"
        icon={BriefcaseBusiness}
        valueClass="text-red-600"
      />

      <CostCard
        label="Utilization Cost"
        value="$1,311.25"
        sub="Current Utilization"
        icon={CircleDollarSign}
        valueClass="text-cyan-600"
        iconColor="text-red-500"
      />
    </div>
  );
}