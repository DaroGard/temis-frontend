import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const acceptedFormats = {
  "application/pdf": [],
  "application/msword": [],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
  "image/jpeg": [],
  "image/png": [],
};

export function FileUploadCard() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Archivos aceptados:", acceptedFiles);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    acceptedFiles,
  } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  return (
    <section className="section-card">
      <div className="section-header">
        <h3 className="section-title">Subir Documentos</h3>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition ${isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"
          }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-slate-600 mb-2">
          {isDragActive ? "Suelta los archivos aquí..." : "Arrastra y suelta tus archivos aquí"}
        </p>
        <button
          type="button"
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded"
        >
          Seleccionar archivos
        </button>
        <p className="mt-2 text-xs text-slate-500">
          Formatos soportados: PDF, DOC, DOCX, JPG, PNG (Máximo 10MB por archivo)
        </p>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-4 text-sm text-red-600">
          !! Algunos archivos fueron rechazados por tipo o tamaño.
        </div>
      )}

      {acceptedFiles.length > 0 && (
        <ul className="mt-4 text-sm text-slate-700 list-disc list-inside">
          {acceptedFiles.map((file, i) => (
            <li key={i}>
              {file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}