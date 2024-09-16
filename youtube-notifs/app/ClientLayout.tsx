"use client";
import React from 'react';
import QueryWrapper from '@/components/QueryWrapper'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryWrapper>
      <ServiceWorkerRegistration />
      {children}
    </QueryWrapper>
  )
}