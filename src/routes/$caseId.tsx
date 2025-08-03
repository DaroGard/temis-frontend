import { createFileRoute } from '@tanstack/react-router'
import CaseDetailPage from '~/components/Cases/CaseDetail/CaseDetailPage'

export const Route = createFileRoute('/$caseId')({
  component: CaseDetailPage,
})