import React, { useState, useEffect } from 'react';
import SceneCard from './components/SceneCard';
import Spinner from './components/Spinner';
import { SCENE_STRUCTURES } from './constants';
import { Scene, GenerationStatus, SceneStructure } from './types';
import * as geminiService from './services/geminiService';
import DownloadIcon from './components/icons/DownloadIcon';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import RegenerateIcon from './components/icons/RegenerateIcon';

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [productName, setProductName] = useState('');
  const [additionalBrief, setAdditionalBrief] = useState('');
  const [sceneStructureId, setSceneStructureId] = useState(SCENE_STRUCTURES[0].id);
  
  const [generateVoiceOver, setGenerateVoiceOver] = useState(true);
  const [addBackgroundMusic, setAddBackgroundMusic] = useState(false);

  const [scenes, setScenes] = useState<Scene[]>([]);
  const [voiceOverUrl, setVoiceOverUrl] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRegeneratingVo, setIsRegeneratingVo] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [apiKeySelected, setApiKeySelected] = useState(false);
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


  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setApiKeySelected(true); // Assume success after open
      setError(null); // Clear previous errors after selecting a new key
    }
  };
  
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
    setVoiceOverUrl(null);
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
      const productPart = await geminiService.fileToGenerativePart(productImage);
      const modelPart = modelImage ? await geminiService.fileToGenerativePart(modelImage) : undefined;
      
      const imageParts = { product: productPart, model: modelPart };

      setLoadingMessage('Membuat naskah...');
      const scriptData = await geminiService.generateScript(selectedStructure, productName, additionalBrief);
      const fullScript = Object.values(scriptData).join(' ');

      setLoadingMessage('Membuat gambar...');
      const imageGenerationPromise = geminiService.generateUgcImages(selectedStructure, productName, additionalBrief, imageParts);

      const voiceOverPromise = generateVoiceOver
          ? geminiService.generateVoiceOver(fullScript).catch(e => {
              console.warn("Voice over failed, continuing...", e);
              return null; // Don't let a VO failure stop the process
            })
          : Promise.resolve(null);
      
      const [images, voUrl] = await Promise.all([
        imageGenerationPromise,
        voiceOverPromise,
      ]);
      
      if (voUrl) setVoiceOverUrl(voUrl);
      
      const updatedScenes = scenes.map((scene, index) => ({
        ...scene,
        image: images[index],
        script: scriptData[`scene${index + 1}`] || '',
        status: GenerationStatus.IMAGE_READY,
        // Generate dynamic video prompt suggestion
        videoPrompt: selectedStructure.scenes[index].videoPromptSuggestion(productName, additionalBrief),
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
  
    const handleRegenerateVoiceOver = async () => {
        if (!generateVoiceOver) return;
        setIsRegeneratingVo(true);
        setError(null);
        try {
            const fullScript = scenes.map(s => s.script).join(' ');
            if (!fullScript.trim()) {
                setError("Naskah tidak boleh kosong untuk membuat voice over.");
                return;
            }
            const voUrl = await geminiService.generateVoiceOver(fullScript);
            setVoiceOverUrl(voUrl);
        } catch (e: any) {
            console.error("Failed to regenerate voice over:", e);
            setError(e.message || "Gagal membuat ulang voice over.");
        } finally {
            setIsRegeneratingVo(false);
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
        const productPart = await geminiService.fileToGenerativePart(productImage);
        const modelPart = modelImage ? await geminiService.fileToGenerativePart(modelImage) : undefined;
        const imageParts = { product: productPart, model: modelPart };

        const newImage = await geminiService.regenerateSingleImage(sceneId, selectedStructure, productName, additionalBrief, imageParts);
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
          const videoUrl = await geminiService.generateVideoFromImage(scene.image, customPrompt, scene.script, addBackgroundMusic);
          setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, videoUrl, status: GenerationStatus.COMPLETED } : s));
      } catch (videoError: any) {
          console.error(`Error generating video for scene ${scene.id}:`, videoError);
          const errorMessage = videoError.message || 'Unknown error';
          let displayError = 'Gagal membuat video.';

          if (errorMessage.includes("Requested entity was not found.")) {
             setError("API Key tidak ditemukan. Mohon pilih ulang API key Anda.");
             setApiKeySelected(false);
             displayError = "API Key tidak ditemukan.";
          } else if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429")) {
              displayError = "Batas kuota untuk key ini habis.";
              setError("Kuota API Key habis. Mohon pilih API key yang lain untuk melanjutkan.");
              setApiKeySelected(false); // Reset to prompt for a new key
          }

          setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, status: GenerationStatus.ERROR, errorMessage: displayError } : s));
      }
  };
  
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const isAnySceneProcessing = scenes.some(s => s.status === GenerationStatus.GENERATING_IMAGE || s.status === GenerationStatus.GENERATING_VIDEO);
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-800">
        <Sidebar isExpanded={isSidebarExpanded} onToggle={() => setIsSidebarExpanded(prev => !prev)} />
        
        {(isLoading || isRegeneratingVo) && (
          <div className="fixed inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-50 text-gray-900">
            <Spinner />
            <p className="mt-4 text-lg font-semibold">{loadingMessage || 'Membuat ulang voice over...'}</p>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto">
            <header className="px-8 py-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Generator UGC</h1>
                <p className="text-sm text-gray-500">Buat konten UGC dengan AI dari gambar produk Anda</p>
            </header>

            <div className="flex-1 p-4 md:p-8 space-y-6">
                <h2 className="text-lg font-semibold">Generasi Saat Ini <span className="text-sm text-gray-500 font-normal">({scenes.filter(s => s.image).length}/4 gambar selesai)</span></h2>
                
                {voiceOverUrl && (
                  <div className="p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-md font-semibold text-gray-900 mb-1 sm:mb-0">Master Voice Over</h3>
                            <p className="text-xs text-gray-500">Satu track audio untuk seluruh video Anda.</p>
                        </div>
                        <div className="w-full sm:w-auto flex items-center gap-2">
                            <audio controls src={voiceOverUrl} className="w-full max-w-xs h-10">
                              Browser Anda tidak mendukung elemen audio.
                            </audio>
                             <button 
                                onClick={handleRegenerateVoiceOver}
                                disabled={isRegeneratingVo || isLoading || isAnySceneProcessing}
                                className="p-2 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                                aria-label="Buat Ulang Voice Over"
                            >
                                <RegenerateIcon className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => handleDownload(voiceOverUrl, 'voice_over.mp3')}
                                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
                                aria-label="Unduh Voice Over"
                            >
                                <DownloadIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  {scenes.map(scene => (
                    <SceneCard 
                        key={scene.id} 
                        scene={scene}
                        onRegenerateImage={handleRegenerateImage}
                        onGenerateVideo={handleGenerateVideo}
                        onVideoPromptChange={handleVideoPromptChange}
                        onScriptChange={handleScriptChange}
                        isVoiceOverEnabled={generateVoiceOver}
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
            generateVoiceOver={generateVoiceOver}
            addBackgroundMusic={addBackgroundMusic}
            onProductImageUpload={setProductImage}
            onModelImageUpload={setModelImage}
            onProductNameChange={setProductName}
            onAdditionalBriefChange={setAdditionalBrief}
            onSceneStructureChange={setSceneStructureId}
            onGenerateVoiceOverChange={setGenerateVoiceOver}
            onAddBackgroundMusicChange={setAddBackgroundMusic}
            onGenerate={handleGenerateInitialAssets}
            apiKeySelected={apiKeySelected}
            onSelectKey={handleSelectKey}
            isLoading={isLoading || isAnySceneProcessing}
            error={error}
        />
    </div>
  );
};

export default App;