'use client';
// Prevent static generation to avoid timeouts
export const dynamic = 'force-dynamic';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderList from '@/components/orders/OrderList';
import { clsx } from 'clsx';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Loading from '@/components/ui/Loading';

const statusTabs = [
	{ name: 'All Orders', status: '' },
	{ name: 'Processing', status: 'processing' },
	{ name: 'Shipped', status: 'shipped' },
	{ name: 'Delivered', status: 'delivered' },
	{ name: 'Cancelled', status: 'cancelled' },
];

function OrdersPageComponent() {
	const searchParams = useSearchParams();
	const [currentStatus, setCurrentStatus] = useState('');
	const isRedirectedFromSuccess = searchParams.get('success') === 'true';

	return (
		<div className="space-y-6">
			{isRedirectedFromSuccess && (
				<div className="rounded-md bg-green-50 p-4">
					<div className="flex">
						<div className="flex-shrink-0">
							<CheckCircleIcon
								className="h-5 w-5 text-green-400"
								aria-hidden="true"
							/>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-green-800">
								Order Placed Successfully
							</h3>
							<p className="mt-2 text-sm text-green-700">
								Thank you for your purchase! Your new order will appear below
								shortly.
							</p>
						</div>
					</div>
				</div>
			)}

			<div className="bg-white shadow sm:rounded-lg">
				<div className="px-4 py-5 sm:p-6 border-b border-gray-200">
					<h3 className="text-lg leading-6 font-medium text-gray-900">
						My Orders
					</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">
						Check the status of your recent orders and view past purchases.
					</p>
				</div>
				<div className="px-4 sm:px-6 border-b border-gray-200">
					<nav
						className="-mb-px flex space-x-8 overflow-x-auto"
						aria-label="Tabs"
					>
						{statusTabs.map((tab) => (
							<button
								key={tab.name}
								onClick={() => setCurrentStatus(tab.status)}
								className={clsx(
									'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
									tab.status === currentStatus
										? 'border-amazon-500 text-amazon-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								)}
							>
								{tab.name}
							</button>
						))}
					</nav>
				</div>
				<div className="p-4 sm:p-6">
					<OrderList
						statusFilter={currentStatus}
						isRedirected={isRedirectedFromSuccess}
					/>
				</div>
			</div>
		</div>
	);
}

export default function OrdersPage() {
	return (
		<Suspense fallback={<Loading fullScreen />}>
			<OrdersPageComponent />
		</Suspense>
	);
}
