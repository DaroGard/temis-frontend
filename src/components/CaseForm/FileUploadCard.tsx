import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const acceptedFormats = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

type Props = {
  onFilesChange?: (files: File[]) => void;
  onRemoveFile?: (index: number) => void;
  disabled?: boolean;
  files?: File[];
};

export function FileUploadCard({ onFilesChange, onRemoveFile, disabled = false, files = [] }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("📁 Archivos aceptados:", acceptedFiles.map(f => f.name));
    onFilesChange?.(acceptedFiles);
  }, [onFilesChange]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    disabled,
  });

  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Subir Documentos</h3>
        <p className="text-sm text-slate-600 mt-1">
          Opcional - Puedes agregar documentos después de crear el caso
        </p>
      </div>

      {/* Zona de drop */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          disabled 
            ? "border-slate-200 bg-slate-50 cursor-not-allowed" 
            : isDragActive 
              ? "border-blue-500 bg-blue-50 scale-[1.02]" 
              : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          {/* Icono */}
          <div className={`p-3 rounded-full ${
            disabled ? 'bg-slate-200' : isDragActive ? 'bg-blue-100' : 'bg-slate-200'
          }`}>
            <svg 
              className={`w-8 h-8 ${
                disabled ? 'text-slate-400' : isDragActive ? 'text-blue-500' : 'text-slate-500'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>

          {/* Texto */}
          <div>
            <p className={`text-base font-medium mb-2 ${
              disabled ? 'text-slate-400' : isDragActive ? 'text-blue-600' : 'text-slate-700'
            }`}>
              {disabled
                ? "Subida de archivos deshabilitada"
                : isDragActive 
                  ? "Suelta los archivos aquí" 
                  : "Arrastra archivos aquí o haz clic para seleccionar"
              }
            </p>
            
            {!disabled && (
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
              >
                Seleccionar archivos
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Formatos soportados: PDF, DOC, DOCX, JPG, PNG • Máximo 10MB por archivo
        </p>
      </div>

      {/* Errores de archivos rechazados */}
      {fileRejections.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800">
                Archivos rechazados ({fileRejections.length})
              </h4>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {fileRejections.map(({ file, errors }, i) => (
                  <li key={i}>
                    <span className="font-medium">{file.name}</span> - {errors.map(e => e.message).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Lista de archivos seleccionados */}
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Archivos seleccionados ({files.length})
          </h4>
          
          <div className="space-y-2">
            {files.map((file, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md group hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Icono del archivo */}
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  {/* Info del archivo */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Tipo desconocido'}
                    </p>
                  </div>
                </div>

                {/* Botón eliminar */}
                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile(i)}
                    className="flex-shrink-0 ml-3 p-1 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar archivo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Los archivos se subirán después de crear el caso
          </p>
        </div>
      )}
    </section>
  );
}