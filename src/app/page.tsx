import { Metadata } from 'next'
import HomePage from '@/components/HomePage'

export const metadata: Metadata = {
  title: 'جذور - متجر للمنتجات الطبيعية',
  description: 'متجر جذور للمنتجات الطبيعية',
}

export default function Page() {
  return <HomePage />
}