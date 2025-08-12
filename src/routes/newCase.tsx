import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from "lucide-react";

import { Navbar } from '~/components/layout/user/UserNavbar';
import { BasicInfoCard } from '~/components/CaseForm/BasicInfoCard';
import { ClientInfoCard } from '~/components/CaseForm/ClientInfoCard';
import { NotesCard } from '~/components/CaseForm/NotesCard';
import { FileUploadCard } from '~/components/CaseForm/FileUploadCard';
import { ScheduleCard } from '~/components/CaseForm/ScheduleCard';
import { FormActions } from '~/components/CaseForm/FormActions';
import Footer from '~/components/layout/user/UserFooter'

const formSchema = z.object({
  title: z.string().min(1),
  startDate: z.string().min(1),
  caseType: z.string().min(1),
  plaintiff: z.string().optional(),
  defendant: z.string().optional(),
  description: z.string().min(1),
  clientName: z.string().optional(),
  clientEmail: z.string().optional(),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  clientRole: z.string().optional(),
  notes: z.string().optional(),
  firstMeeting: z.string().optional(),
});

export const Route = createFileRoute('/newCase')({
  component: NewCase,
});

function NewCase() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      startDate: '',
      caseType: '',
      plaintiff: '',
      defendant: '',
      description: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      clientRole: '',
      notes: '',
      firstMeeting: '',
    },
  });

  const { handleSubmit, register } = form;

  const onSubmit = (data: any) => {
    console.log('Nuevo Caso:', data);
    // lógica de envío API
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Navbar />
      <div className="bg-white border-b border-gray-300 w-full">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Nuevo caso</h1>
          <p className="text-sm text-slate-600 mt-1">Crea un nuevo caso legal</p>
        </div>
      </div>
      <div className="px-6 py-4">
        <a
          href="/cases"
          className="inline-flex items-center text-sm text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Casos
        </a>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-6 max-w-5xl mx-auto text-slate-900"
      >
        <BasicInfoCard register={register} />
        <ClientInfoCard register={register} />
        <NotesCard register={register} />
        <FileUploadCard />
        <ScheduleCard register={register} />
        <FormActions />
      </form>
      <Footer />
    </div>
  );
}
