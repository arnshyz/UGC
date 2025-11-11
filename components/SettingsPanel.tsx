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
    addBackgroundMusic: boolean;
    onProductImageUpload: (file: File) => void;
    onModelImageUpload: (file: File) => void;
    onProductNameChange: (name: string) => void;
    onAdditionalBriefChange: (brief: string) => void;
    onSceneStructureChange: (id: string) => void;
    onAddBackgroundMusicChange: (enabled: boolean) => void;
    onGenerate: () => void;
    isLoading: boolean;
    error: string | null;
}

const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
    const {
        productImage,
        productName, onProductNameChange,
        additionalBrief, onAdditionalBriefChange,
        sceneStructureId, onSceneStructureChange,
        addBackgroundMusic, onAddBackgroundMusicChange,
        onProductImageUpload, onModelImageUpload,
        onGenerate, isLoading, error
    } = props;

    const canGenerate = Boolean(productName && productImage && !isLoading);

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
                    <Switch label="Tambah Musik Latar" enabled={addBackgroundMusic} onChange={onAddBackgroundMusicChange} disabled={isLoading} />
                </div>
            </div>

            <footer className="p-4 border-t border-gray-200 bg-white">
                <div className="text-xs text-gray-500 mb-4 text-center">
                    Pastikan Freepik API Key telah dikonfigurasi di file lingkungan (.env) dan kuotanya mencukupi sebelum membuat aset.
                </div>
                <button
                    onClick={onGenerate}
                    disabled={!canGenerate}
                    className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="text-xl">✨</span>
                    {isLoading ? 'Membuat...' : 'Buat Konten UGC'}
                </button>
                {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
            </footer>
        </aside>
    );
};

export default SettingsPanel;