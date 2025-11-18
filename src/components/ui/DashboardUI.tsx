import React from 'react'
import DashboardMenu from '../layout/DashboardMenu'
import DashboardHeader from '../layout/DashboardHeader'

export default function DashboardUI({ children }: { children: React.ReactNode }) {
    return (
        <React.Fragment>
            <DashboardHeader />

            <main className="dashboard--base">
                <DashboardMenu />
                <section className='content--block'>
                    {children}
                </section>
            </main>
        </React.Fragment>
    )
}