"use client";

import type { ComponentProps } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "../lib";

export const Tabs = TabsPrimitive.Root;
export function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn("pt-tabs__list", className)} {...props} />;
}
export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger className={cn("pt-tabs__trigger", className)} {...props} />
  );
}
export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content className={cn("pt-tabs__content", className)} {...props} />
  );
}

export function SegmentedControl({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("pt-segmented", className)} {...props} />;
}
export function SegmentedControlList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List className={cn("pt-segmented__list", className)} {...props} />
  );
}
export function SegmentedControlItem({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger className={cn("pt-segmented__item", className)} {...props} />
  );
}
export const SegmentedControlPanel = TabsPrimitive.Content;
