import React, { JSX, useState } from "react";
import { FileText, FileImage, File, Eye, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "~/components/generals/button";

export interface CaseFile {
    id: string;
    name: string;
    type: "pdf" | "doc" | "docx" | "jpg" | "png";
    size: number;
    url: string;
    uploadedAt: Date;
}

interface CaseFilesCardProps {
    files: CaseFile[];
}

const iconMap: Record<CaseFile["type"], JSX.Element> = {
    pdf: <FileText className="text-warning" />,
    doc: <FileText className="text-links" />,
    docx: <FileText className="text-links" />,
    jpg: <FileImage className="text-success" />,
    png: <FileImage className="text-success" />,
};

export const CaseFilesCard: React.FC<CaseFilesCardProps> = ({ files }) => {
    const [previewFile, setPreviewFile] = useState<CaseFile | null>(null);

    const [modalWidthPct, setModalWidthPct] = useState(70);
    const [modalHeightPct, setModalHeightPct] = useState(80);

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Archivos del Caso</h3>

            {files.length === 0 ? (
                <p className="text-sm text-gray-500">No hay archivos cargados.</p>
            ) : (
                <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    {files.map((file) => (
                        <li
                            key={file.id}
                            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                {iconMap[file.type] || <File className="text-gray-400" />}
                                <div>
                                    <p className="text-sm font-medium text-gray-800 truncate w-48">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatSize(file.size)} • {format(file.uploadedAt, "dd/MM/yyyy")}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewFile(file)}
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            {previewFile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 text-primary">
                    <div
                        className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                            width: `${modalWidthPct}vw`,
                            height: `${modalHeightPct}vh`,
                            maxWidth: "95vw",
                            maxHeight: "95vh",
                        }}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h4 className="text-lg font-semibold truncate text-black">{previewFile.name}</h4>
                            <Button variant="ghost" onClick={() => setPreviewFile(null)}>
                                <X className="w-5 h-5 text-black" />
                            </Button>
                        </div>
                        <div className="flex space-x-6 items-center p-3 border-b border-gray-200 bg-gray-50">
                            <label className="flex items-center space-x-2 text-gray-700 select-none">
                                <span className="font-medium">Ancho:</span>
                                <input
                                    type="range"
                                    min={30}
                                    max={95}
                                    value={modalWidthPct}
                                    onChange={(e) => setModalWidthPct(Number(e.target.value))}
                                    className="w-48 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer
                                    transition-colors duration-200 ease-in-out
                                    hover:bg-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-links"
                                    style={{ accentColor: "#3b82f6" }}
                                />
                                <span className="w-10 text-right font-mono">{modalWidthPct}vw</span>
                            </label>

                            <label className="flex items-center space-x-2 text-gray-700 select-none">
                                <span className="font-medium">Alto:</span>
                                <input
                                    type="range"
                                    min={30}
                                    max={95}
                                    value={modalHeightPct}
                                    onChange={(e) => setModalHeightPct(Number(e.target.value))}
                                    className="w-48 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer
                                    transition-colors duration-200 ease-in-out
                                    hover:bg-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-links"
                                    style={{ accentColor: "#3b82f6" }}
                                />
                                <span className="w-10 text-right font-mono">{modalHeightPct}vh</span>
                            </label>
                        </div>

                        <div className="flex-1 overflow-auto bg-gray-50 p-4">
                            {["jpg", "png"].includes(previewFile.type) ? (
                                <img
                                    src={previewFile.url}
                                    alt={previewFile.name}
                                    className="w-full h-full object-contain"
                                />
                            ) : previewFile.type === "pdf" ? (
                                <iframe
                                    src={previewFile.url}
                                    className="w-full h-full"
                                    title="PDF Preview"
                                />
                            ) : previewFile.type === "doc" || previewFile.type === "docx" ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-700 p-6 text-center">
                                    <FileText className="w-12 h-12 mb-4 text-links" />
                                    <p className="mb-2 font-semibold">
                                        Vista previa no disponible para documentos Word.
                                    </p>
                                    <p className="mb-4">
                                        Para ver este documento, descárgalo y ábrelo en tu dispositivo.
                                    </p>
                                    <a
                                        href={previewFile.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-links hover:underline font-semibold"
                                        download={previewFile.name}
                                    >
                                        Descargar archivo
                                    </a>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-600 p-6 text-center">
                                    <FileText className="w-12 h-12 mb-4 text-gray-400" />
                                    <p>Vista previa no disponible para este tipo de archivo.</p>
                                    <a
                                        href={previewFile.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-links hover:underline mt-2 font-semibold"
                                    >
                                        Descargar archivo
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};