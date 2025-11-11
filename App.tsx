import React, { useState, useEffect } from 'react';
import SceneCard from './components/SceneCard';
import Spinner from './components/Spinner';
import { SCENE_STRUCTURES } from './constants';
import { Scene, GenerationStatus } from './types';
import * as freepikService from './services/freepikService';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [productName, setProductName] = useState('');
  const [additionalBrief, setAdditionalBrief] = useState('');
  const [sceneStructureId, setSceneStructureId] = useState(SCENE_STRUCTURES[0].id);

  const [addBackgroundMusic, setAddBackgroundMusic] = useState(false);

  const [scenes, setScenes] = useState<Scene[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);

  // Sync scenes state with selected structure
  useEffect(() => {
    const selectedStructure = SCENE_STRUCTURES.find(s => s.id === sceneStructureId) || SCENE_STRUCTURES[0];
    const newScenes = selectedStructure.scenes.map((sceneConfig, index) => ({
        id: index + 1,
        title: sceneConfig.title,
        description: sceneConfig.description,
        image: '',
        script: '',
        status: GenerationStatus.PENDING,
        videoPrompt: '', // Will be populated dynamically
    }));
    setScenes(newScenes);
  }, [sceneStructureId]);

  const handleVideoPromptChange = (sceneId: number, prompt: string) => {
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, videoPrompt: prompt } : s));
  };
  
  const handleScriptChange = (sceneId: number, script: string) => {
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, script: script } : s));
  };

  const resetState = () => {
    const selectedStructure = SCENE_STRUCTURES.find(s => s.id === sceneStructureId) || SCENE_STRUCTURES[0];
    const initialScenes = selectedStructure.scenes.map((sceneConfig, index) => ({
      id: index + 1,
      title: sceneConfig.title,
      description: sceneConfig.description,
      image: '',
      script: '',
      status: GenerationStatus.PENDING,
      videoPrompt: '', // Will be populated dynamically
    }));
    setScenes(initialScenes);
    setError(null);
    setIsLoading(false);
    setLoadingMessage('');
  };

  const handleGenerateInitialAssets = async () => {
    setError(null); // Clear previous errors
    const selectedStructure = SCENE_STRUCTURES.find(s => s.id === sceneStructureId)!;
    
    // Validation for required model image
    const modelIsRequired = selectedStructure.scenes.some(scene => scene.requiredParts.includes('model'));
    if (modelIsRequired && !modelImage) {
        setError(`Struktur adegan "${selectedStructure.name}" membutuhkan gambar model. Mohon unggah.`);
        return;
    }

    if (!productImage || !productName) {
      setError('Mohon unggah gambar produk dan masukkan nama produk.');
      return;
    }

    resetState();
    setIsLoading(true);

    try {
      setLoadingMessage('Menyiapkan aset...');
      const productPart = await freepikService.fileToGenerativePart(productImage);
      const modelPart = modelImage ? await freepikService.fileToGenerativePart(modelImage) : undefined;

      const imageParts = { product: productPart, model: modelPart };

      setLoadingMessage('Membuat gambar...');
      const imageGenerationPromise = freepikService.generateUgcImages(
        selectedStructure,
        productName,
        additionalBrief,
        imageParts
      );

      const images = await imageGenerationPromise;

      const updatedScenes = selectedStructure.scenes.map((sceneConfig, index) => ({
        id: index + 1,
        title: sceneConfig.title,
        description: sceneConfig.description,
        image: images[index],
        script: scenes[index]?.script || '',
        status: GenerationStatus.IMAGE_READY,
        videoPrompt: sceneConfig.videoPromptSuggestion(productName, additionalBrief),
      }));
      setScenes(updatedScenes);

    } catch (e: any) {
      console.error('Initial generation failed:', e);
      setError(e.message || 'Terjadi kesalahan tak terduga.');
      setScenes(prev => prev.map(s => ({...s, status: GenerationStatus.ERROR, errorMessage: e.message})));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };


  const handleRegenerateImage = async (sceneId: number) => {
    const selectedStructure = SCENE_STRUCTURES.find(s => s.id === sceneStructureId)!;
    const sceneConfig = selectedStructure.scenes[sceneId - 1];

    if (sceneConfig.requiredParts.includes('model') && !modelImage) {
        setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, status: GenerationStatus.ERROR, errorMessage: 'Gambar model diperlukan untuk adegan ini.' } : s));
        return;
    }

    if (!productImage) return;

    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, status: GenerationStatus.GENERATING_IMAGE, errorMessage: '' } : s));
    
    try {
        const productPart = await freepikService.fileToGenerativePart(productImage);
        const modelPart = modelImage ? await freepikService.fileToGenerativePart(modelImage) : undefined;
        const imageParts = { product: productPart, model: modelPart };

        const newImage = await freepikService.regenerateSingleImage(
          sceneId,
          selectedStructure,
          productName,
          additionalBrief,
          imageParts
        );
        setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, image: newImage, status: GenerationStatus.IMAGE_READY } : s));
    } catch (e: any) {
        console.error(`Error regenerating image for scene ${sceneId}:`, e);
        setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, status: GenerationStatus.ERROR, errorMessage: e.message } : s));
    }
  };

  const handleGenerateVideo = async (sceneId: number, customPrompt: string) => {
      const scene = scenes.find(s => s.id === sceneId);
      if (!scene || !scene.image) return;

      setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, status: GenerationStatus.GENERATING_VIDEO, errorMessage: '' } : s));
      
      try {
          const videoUrl = await freepikService.generateVideoFromImage(
            scene.image,
            customPrompt,
            scene.script,
            addBackgroundMusic
          );
          setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, videoUrl, status: GenerationStatus.COMPLETED } : s));
      } catch (videoError: any) {
          console.error(`Error generating video for scene ${scene.id}:`, videoError);
          const errorMessage = videoError.message || 'Unknown error';
          let displayError = 'Gagal membuat video.';

          if (errorMessage.includes('Freepik API key')) {
            setError('Konfigurasi API Freepik bermasalah.');
            displayError = 'Konfigurasi API Freepik bermasalah.';
          }

          setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, status: GenerationStatus.ERROR, errorMessage: displayError } : s));
      }
  };
  
  const isAnySceneProcessing = scenes.some(s => s.status === GenerationStatus.GENERATING_IMAGE || s.status === GenerationStatus.GENERATING_VIDEO);

  const totalScenes = scenes.length;
  const completedImages = scenes.filter(s => s.image).length;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-800">
        <Sidebar isExpanded={isSidebarExpanded} onToggle={() => setIsSidebarExpanded(prev => !prev)} />

        {isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-50 text-gray-900">
            <Spinner />
            <p className="mt-4 text-lg font-semibold">{loadingMessage || 'Memproses...'}</p>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto">
            <header className="px-8 py-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Generator UGC</h1>
                <p className="text-sm text-gray-500">Buat konten UGC dengan AI dari gambar produk Anda</p>
            </header>

            <div className="flex-1 p-4 md:p-8 space-y-6">
                <h2 className="text-lg font-semibold">
                  Generasi Saat Ini{' '}
                  <span className="text-sm text-gray-500 font-normal">
                    ({completedImages}/{totalScenes} gambar selesai)
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {scenes.map(scene => (
                    <SceneCard
                        key={scene.id}
                        scene={scene}
                        onRegenerateImage={handleRegenerateImage}
                        onGenerateVideo={handleGenerateVideo}
                        onVideoPromptChange={handleVideoPromptChange}
                        onScriptChange={handleScriptChange}
                    />
                  ))}
                </div>
            </div>
        </main>

        {/* Settings Panel */}
        <SettingsPanel
            productImage={productImage}
            modelImage={modelImage}
            productName={productName}
            additionalBrief={additionalBrief}
            sceneStructureId={sceneStructureId}
            addBackgroundMusic={addBackgroundMusic}
            onProductImageUpload={setProductImage}
            onModelImageUpload={setModelImage}
            onProductNameChange={setProductName}
            onAdditionalBriefChange={setAdditionalBrief}
            onSceneStructureChange={setSceneStructureId}
            onAddBackgroundMusicChange={setAddBackgroundMusic}
            onGenerate={handleGenerateInitialAssets}
            isLoading={isLoading || isAnySceneProcessing}
            error={error}
        />
    </div>
  );
};

export default App;