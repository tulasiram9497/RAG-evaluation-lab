import React, { useState } from 'react';
import { 
  Upload, 
  Trash2, 
  Eye, 
  FileText, 
  RefreshCw, 
  Plus, 
  AlertCircle, 
  Check, 
  Layers, 
  Clock,
  HardDrive
} from 'lucide-react';
import { DocumentMetadata, Chunk } from '../../server/types.js';
import { api } from '../services/api.js';

interface DocumentManagerPageProps {
  documents: DocumentMetadata[];
  onRefresh: () => void;
}

export const DocumentManagerPage: React.FC<DocumentManagerPageProps> = ({
  documents,
  onRefresh,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentMetadata | null>(null);
  const [docChunks, setDocChunks] = useState<Chunk[]>([]);
  const [isChunkModalOpen, setIsChunkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loadingChunks, setLoadingChunks] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Upload Form State
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [rawFilename, setRawFilename] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [rawCategory, setRawCategory] = useState('AI Engineering');
  const [chunkingStrategy, setChunkingStrategy] = useState<'recursive' | 'fixed' | 'overlapping' | 'semantic'>('recursive');
  const [chunkSize, setChunkSize] = useState(250);
  const [chunkOverlap, setChunkOverlap] = useState(40);
  const [isUploading, setIsUploading] = useState(false);

  const handleInspectChunks = async (doc: DocumentMetadata) => {
    setSelectedDoc(doc);
    setIsChunkModalOpen(true);
    setLoadingChunks(true);
    try {
      const res = await api.getDocumentChunks(doc.id);
      setDocChunks(res.chunks);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: 'Failed to load chunks: ' + err.message });
    } finally {
      setLoadingChunks(false);
    }
  };

  const handleDelete = async (docId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"? All vectors and BM25 index postings will be permanently removed.`)) {
      return;
    }
    try {
      await api.deleteDocument(docId);
      setActionMessage({ type: 'success', text: `Document "${filename}" and associated vectors deleted.` });
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  const handleResetSample = async () => {
    if (!confirm('Reset knowledge base to curated 5-document sample corpus? This will clear custom uploads.')) {
      return;
    }
    try {
      await api.resetSampleCorpus();
      setActionMessage({ type: 'success', text: 'Curated sample corpus restored successfully.' });
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setActionMessage(null);

    try {
      if (uploadMode === 'file') {
        if (!fileToUpload) {
          throw new Error('Please select a file to upload');
        }
        await api.uploadFile(fileToUpload, {
          category: rawCategory,
          chunkingStrategy,
          chunkSize,
          chunkOverlap,
        });
        setActionMessage({ type: 'success', text: `File "${fileToUpload.name}" processed and indexed successfully.` });
      } else {
        if (!rawFilename.trim() || !rawContent.trim()) {
          throw new Error('Filename and text content are required');
        }
        await api.uploadRawDocument({
          filename: rawFilename.trim(),
          content: rawContent.trim(),
          category: rawCategory,
          chunkingStrategy,
          chunkSize,
          chunkOverlap,
        });
        setActionMessage({ type: 'success', text: `Document "${rawFilename}" ingested and indexed.` });
      }

      setIsUploadModalOpen(false);
      setFileToUpload(null);
      setRawFilename('');
      setRawContent('');
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Document Ingestion & Knowledge Base</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage raw documents, configure chunking strategies, inspect vector index status, and detect duplicates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-1.5 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest Document</span>
          </button>
          <button
            onClick={handleResetSample}
            className="px-3.5 py-1.5 bg-white border border-stone-300 text-stone-700 rounded text-xs font-medium hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
            <span>Restore Curated Corpus</span>
          </button>
        </div>
      </div>

      {/* Action Message Banner */}
      {actionMessage && (
        <div
          className={`p-3 rounded text-xs flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">
            Indexed Documents ({documents.length})
          </h2>
          <span className="text-xs text-stone-500">
            Storage Engine: Qdrant Vector Store + BM25 Sparse Index
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-16 text-stone-400 text-xs">
            No documents in knowledge base. Click "Ingest Document" or "Restore Curated Corpus".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-medium">Document</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Size</th>
                  <th className="px-5 py-3 font-medium">Est. Tokens</th>
                  <th className="px-5 py-3 font-medium">Chunks</th>
                  <th className="px-5 py-3 font-medium">SHA-256 Hash</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-5 py-3 font-medium text-stone-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-stone-400 shrink-0" />
                      <span className="truncate max-w-[200px]" title={doc.filename}>
                        {doc.filename}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-600">
                      {doc.category || 'General'}
                    </td>
                    <td className="px-5 py-3 uppercase text-[11px] font-mono text-stone-500">
                      {doc.fileType}
                    </td>
                    <td className="px-5 py-3 font-mono text-stone-500">
                      {(doc.sizeBytes / 1024).toFixed(1)} KB
                    </td>
                    <td className="px-5 py-3 font-mono text-stone-500">
                      {doc.totalTokens.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-mono text-stone-900 font-medium">
                      {doc.totalChunks}
                    </td>
                    <td className="px-5 py-3 font-mono text-[10px] text-stone-400" title={doc.hash}>
                      {doc.hash.substring(0, 10)}...
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleInspectChunks(doc)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          title="Inspect Chunks"
                          aria-label={`Inspect chunks of ${doc.filename}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.filename)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Delete Document"
                          aria-label={`Delete ${doc.filename}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chunk Inspector Modal */}
      {isChunkModalOpen && selectedDoc && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">
                  Chunk Inspector: {selectedDoc.filename}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {selectedDoc.totalChunks} chunks · Total ~{selectedDoc.totalTokens} tokens
                </p>
              </div>
              <button
                onClick={() => setIsChunkModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {loadingChunks ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Loading indexed chunks...
                </div>
              ) : docChunks.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  No chunks found for this document.
                </div>
              ) : (
                docChunks.map((chunk) => (
                  <div key={chunk.id} className="border border-stone-200 rounded p-4 text-xs bg-stone-50/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">Chunk #{chunk.chunkIndex + 1}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="text-stone-500 font-mono">ID: {chunk.id}</span>
                        {chunk.sectionHeading && (
                          <>
                            <span aria-hidden="true" className="text-stone-300">·</span>
                            <span className="text-stone-600 font-medium">§ {chunk.sectionHeading}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-stone-500 text-[11px] font-mono">
                        <span>{chunk.tokenCount} tokens</span>
                        <span>Page ~{chunk.pageNumber || 1}</span>
                      </div>
                    </div>
                    <p className="text-stone-700 whitespace-pre-wrap leading-relaxed font-sans bg-white border border-stone-100 rounded p-3">
                      {chunk.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-3 border-t border-stone-200 bg-stone-50/50 flex justify-end">
              <button
                onClick={() => setIsChunkModalOpen(false)}
                className="px-4 py-2 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ingest Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full border border-stone-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Ingest New Document</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 overflow-y-auto space-y-4">
              {/* Mode switch */}
              <div className="flex items-center gap-2 p-1 bg-stone-100 rounded">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                    uploadMode === 'file' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Upload File (PDF / DOCX / MD / TXT)
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('text')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                    uploadMode === 'text' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Direct Markdown / Text Paste
                </button>
              </div>

              {uploadMode === 'file' ? (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Select Document File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.md,.markdown,.txt"
                    onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                    className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-medium file:bg-stone-900 file:text-white hover:file:bg-stone-800"
                    required
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Supported: PDF, DOCX, Markdown (.md), and Plain Text (.txt) up to 20MB.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Document Filename
                    </label>
                    <input
                      type="text"
                      value={rawFilename}
                      onChange={(e) => setRawFilename(e.target.value)}
                      placeholder="e.g., enterprise_architecture_guidelines.md"
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Text / Markdown Content
                    </label>
                    <textarea
                      value={rawContent}
                      onChange={(e) => setRawContent(e.target.value)}
                      rows={6}
                      placeholder="Paste document text here..."
                      className="w-full text-xs border border-stone-300 rounded p-3 font-mono text-stone-900"
                      required
                    />
                  </div>
                </>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={rawCategory}
                  onChange={(e) => setRawCategory(e.target.value)}
                  placeholder="e.g. AI Engineering, Compliance, Clinical"
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-900"
                />
              </div>

              {/* Chunking Settings */}
              <div className="border-t border-stone-200 pt-4 space-y-3">
                <h4 className="text-xs font-semibold text-stone-900">Chunking Engine Configuration</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Strategy</label>
                    <select
                      value={chunkingStrategy}
                      onChange={(e) => setChunkingStrategy(e.target.value as any)}
                      className="w-full text-xs border border-stone-300 rounded px-2.5 py-1.5 bg-white text-stone-800"
                    >
                      <option value="recursive">Recursive (Recommended)</option>
                      <option value="semantic">Semantic (Header-aware)</option>
                      <option value="overlapping">Overlapping</option>
                      <option value="fixed">Fixed Size</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Chunk Size (tokens)</label>
                    <input
                      type="number"
                      value={chunkSize}
                      onChange={(e) => setChunkSize(Number(e.target.value))}
                      min={50}
                      max={1000}
                      className="w-full text-xs border border-stone-300 rounded px-2.5 py-1.5 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Overlap (tokens)</label>
                    <input
                      type="number"
                      value={chunkOverlap}
                      onChange={(e) => setChunkOverlap(Number(e.target.value))}
                      min={0}
                      max={200}
                      className="w-full text-xs border border-stone-300 rounded px-2.5 py-1.5 text-stone-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUploading ? 'Processing...' : 'Ingest & Index'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
