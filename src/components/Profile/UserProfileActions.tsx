import React, { useState } from 'react';
import { Pencil, Lock } from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';

interface Props {
  user: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    city: string;
  };
  apiDomain: string;
  onProfileUpdated: () => void;
}

export const UserProfileActions: React.FC<Props> = ({ user, apiDomain, onProfileUpdated }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  return (
    <>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setOpenEdit(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[var(--primary-color)] text-[var(--secondary-color)] shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all text-sm font-semibold"
        >
          <Pencil className="w-5 h-5" />
          Editar Perfil
        </button>

        <button
          type="button"
          onClick={() => setOpenPassword(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[var(--links-color)] text-[var(--secondary-color)] shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all text-sm font-semibold"
        >
          <Lock className="w-5 h-5" />
          Cambiar Contraseña
        </button>
      </div>

      {/* Modal Editar Perfil */}
      <EditProfileModal
        user={user}
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        apiDomain={apiDomain}
        onSuccess={onProfileUpdated}
      />

      {/* Modal Cambiar Contraseña */}
      <ChangePasswordModal
        isOpen={openPassword}
        onClose={() => setOpenPassword(false)}
        apiDomain={apiDomain}
      />
    </>
  );
};