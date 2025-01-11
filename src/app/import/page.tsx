'use client'

import React from 'react'
import ImportData from '@/components/ImportData'
import PageTemplate from "@/components/PageTemplate";

export default function ImportPage() {
    return (
        <PageTemplate>
            <div className="container mx-auto px-4 py-8">
                <ImportData />
            </div>
        </PageTemplate>
    )
}
