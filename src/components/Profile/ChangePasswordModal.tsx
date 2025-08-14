import React, { useState } from 'react';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiDomain: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    isOpen,
    onClose,
    apiDomain
}) => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
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
        setError(null);
        setSuccess(null);

        if (formData.new_password !== formData.confirm_password) {
            setError('La nueva contraseña y la confirmación no coinciden');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${apiDomain}/user/change-password`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_password: formData.current_password,
                    new_password: formData.new_password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.detail || 'Error al cambiar la contraseña');
            }

            setSuccess(data?.message || 'Contraseña cambiada correctamente');
            setTimeout(onClose, 1000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm text-black">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        name="current_password"
                        placeholder="Contraseña actual"
                        value={formData.current_password}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />

                    <input
                        type="password"
                        name="new_password"
                        placeholder="Nueva contraseña"
                        value={formData.new_password}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />

                    <input
                        type="password"
                        name="confirm_password"
                        placeholder="Confirmar nueva contraseña"
                        value={formData.confirm_password}
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
                            className="px-4 py-2 rounded-lg bg-[var(--links-color)] text-white hover:opacity-90"
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