import React, { useState } from 'react';

interface EditProfileModalProps {
    user: {
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        city: string;
    };
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    apiDomain: string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
    user,
    isOpen,
    onClose,
    onSuccess,
    apiDomain
}) => {
    const [formData, setFormData] = useState(user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(`${apiDomain}/user/profile`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.detail || 'Error al actualizar el perfil');
            }

            setSuccess(data?.message || 'Perfil actualizado correctamente');
            onSuccess();
            setTimeout(onClose, 800);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm text-black">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                    <input
                        type="text"
                        name="first_name"
                        placeholder="Nombre"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Apellido"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Teléfono"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="Ciudad"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />

                    {error && <p className="text-warning text-sm">{error}</p>}
                    {success && <p className="text-success text-sm">{success}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white hover:opacity-90"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};