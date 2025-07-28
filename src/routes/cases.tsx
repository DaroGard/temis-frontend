import { createFileRoute } from '@tanstack/react-router'
import CasesPage from '~/components/Cases/CasePage'

export const Route = createFileRoute('/cases')({
  component: CasesPage,
});
