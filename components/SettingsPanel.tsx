import React from 'react';
import ImageUploader from './ImageUploader';
import Switch from './Switch';
import { SCENE_STRUCTURES } from '../constants';
import { SceneStructure } from '../types';

interface SettingsPanelProps {
    productImage: File | null;
    modelImage: File | null;
    productName: string;
    additionalBrief: string;
    sceneStructureId: string;
    generateVoiceOver: boolean;
    addBackgroundMusic: boolean;
    freepikApiKey: string;
    onProductImageUpload: (file: File) => void;
    onModelImageUpload: (file: File) => void;
    onProductNameChange: (name: string) => void;
    onAdditionalBriefChange: (brief: string) => void;
    onSceneStructureChange: (id: string) => void;
    onGenerateVoiceOverChange: (enabled: boolean) => void;
    onAddBackgroundMusicChange: (enabled: boolean) => void;
    onFreepikApiKeyChange: (key: string) => void;
    onGenerate: () => void;
    apiKeySelected: boolean;
    onSelectKey: () => void;
    isLoading: boolean;
    error: string | null;
}

const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
    const {
        productName, onProductNameChange,
        additionalBrief, onAdditionalBriefChange,
        sceneStructureId, onSceneStructureChange,
        generateVoiceOver, onGenerateVoiceOverChange,
        addBackgroundMusic, onAddBackgroundMusicChange,
        freepikApiKey, onFreepikApiKeyChange,
        onProductImageUpload, onModelImageUpload,
        onGenerate, apiKeySelected, onSelectKey, isLoading, error
    } = props;

    const canGenerate = Boolean(productName && props.productImage && apiKeySelected && freepikApiKey && !isLoading);

    return (
        <aside className="w-full md:w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col">
            <header className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Unggah & Pengaturan</h2>
                <p className="text-xs text-gray-500">Konfigurasi prompt Anda</p>
            </header>

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                <ImageUploader id="product" title="Gambar Produk" onImageUpload={onProductImageUpload} disabled={isLoading} />
                <ImageUploader id="model" title="Gambar Model" onImageUpload={onModelImageUpload} disabled={isLoading} isOptional={true} />
                
                <div>
                    <label htmlFor="product-name" className="text-sm font-semibold text-gray-600 mb-2 block">Nama Produk</label>
                    <input
                        type="text"
                        id="product-name"
                        value={productName}
                        onChange={(e) => onProductNameChange(e.target.value)}
                        placeholder="Contoh: 'Serum HydraGlow'"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="scene-structure" className="text-sm font-semibold text-gray-600 mb-2 block">Gaya Prompt (Struktur Adegan)</label>
                    <select
                        id="scene-structure"
                        value={sceneStructureId}
                        onChange={(e) => onSceneStructureChange(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {SCENE_STRUCTURES.map((structure: SceneStructure) => (
                            <option key={structure.id} value={structure.id}>{structure.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="freepik-api-key" className="text-sm font-semibold text-gray-600 mb-2 block">Freepik API Key</label>
                    <input
                        type="password"
                        id="freepik-api-key"
                        value={freepikApiKey}
                        onChange={(e) => onFreepikApiKeyChange(e.target.value)}
                        placeholder="Masukkan Freepik API Key"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">Gunakan API key dari <a className="text-purple-500 hover:underline" href="https://www.freepik.com/profile/api-keys" target="_blank" rel="noopener noreferrer">Freepik</a>.</p>
                </div>
                
                 <div>
                    <label htmlFor="additional-brief" className="text-sm font-semibold text-gray-600 mb-2 block">Brief Produk (Opsional)</label>
                    <textarea
                        id="additional-brief"
                        rows={3}
                        value={additionalBrief}
                        onChange={(e) => onAdditionalBriefChange(e.target.value)}
                        placeholder="Contoh: Mempromosikan botol minum ramah lingkungan untuk pegiat fitness..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                    <Switch label="Buat Voice Over" enabled={generateVoiceOver} onChange={onGenerateVoiceOverChange} disabled={isLoading} />
                    <Switch label="Tambah Musik Latar" enabled={addBackgroundMusic} onChange={onAddBackgroundMusicChange} disabled={isLoading} />
                </div>
            </div>

            <footer className="p-4 border-t border-gray-200 bg-white">
                <div className="text-xs text-gray-500 mb-4 text-center">
                    Pastikan Freepik API Key aktif dan kuota mencukupi sebelum membuat aset.
                </div>
                {!apiKeySelected ? (
                    <div className="flex flex-col items-center text-center">
                        <p className="mb-2 text-sm text-red-500 font-medium">Fitur naskah & voice over memerlukan Google Gemini API Key.</p>
                        <p className="mb-3 text-xs text-gray-500">Ini mungkin dikenakan biaya. Lihat
                            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline"> dokumen penagihan</a>.
                        </p>
                        <button onClick={onSelectKey} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                            Pilih Kunci API
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={onGenerate} 
                        disabled={!canGenerate}
                        className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="text-xl">✨</span>
                        {isLoading ? 'Membuat...' : 'Buat Konten UGC'}
                    </button>
                )}
                {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
            </footer>
        </aside>
    );
};

export default SettingsPanel;