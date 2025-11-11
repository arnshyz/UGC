import React from 'react';
import { Scene, GenerationStatus } from '../types';
import Spinner from './Spinner';
import DownloadIcon from './icons/DownloadIcon';
import RegenerateIcon from './icons/RegenerateIcon';
import VideoIcon from './icons/VideoIcon';

interface SceneCardProps {
  scene: Scene;
  onRegenerateImage: (sceneId: number) => void;
  onGenerateVideo: (sceneId: number, customPrompt: string) => void;
  onVideoPromptChange: (sceneId: number, prompt: string) => void;
  onScriptChange: (sceneId: number, script: string) => void;
  isVoiceOverEnabled: boolean;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, onRegenerateImage, onGenerateVideo, onVideoPromptChange, onScriptChange, isVoiceOverEnabled }) => {

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isActionInProgress = scene.status === GenerationStatus.GENERATING_IMAGE || scene.status === GenerationStatus.GENERATING_VIDEO;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* Image Column */}
        <div className="relative">
            <div className="w-full aspect-[9/16] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300">
              {scene.status === GenerationStatus.GENERATING_IMAGE && <Spinner />}
              {scene.image && <img src={scene.image} alt={`Scene ${scene.id}`} className="w-full h-full object-cover" />}
              {!scene.image && scene.status !== GenerationStatus.GENERATING_IMAGE && <span className="text-gray-500 text-sm">Gambar {scene.id}</span>}
            </div>
             {scene.image && scene.status !== GenerationStatus.GENERATING_IMAGE && (
                 <button 
                    onClick={() => handleDownload(scene.image, `scene_${scene.id}_image.png`)}
                    className="absolute top-2 right-2 bg-white bg-opacity-60 text-black p-2 rounded-full hover:bg-opacity-80 transition"
                    aria-label="Unduh Gambar"
                >
                    <DownloadIcon className="w-4 h-4" />
                </button>
             )}
        </div>

        {/* Video Column */}
        <div className="relative">
            <div className="w-full aspect-[9/16] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300">
                {scene.status === GenerationStatus.GENERATING_VIDEO && (
                    <div className="text-center text-gray-800">
                        <Spinner />
                        <p className="text-xs mt-2">Membuat video...</p>
                    </div>
                )}
                {scene.videoUrl && <video src={scene.videoUrl} controls className="w-full h-full object-cover" />}
                {!scene.videoUrl && scene.status !== GenerationStatus.GENERATING_VIDEO && <span className="text-gray-500 text-sm">Belum ada video</span>}
                {scene.videoUrl && scene.status === GenerationStatus.COMPLETED && (
                    <button 
                        onClick={() => handleDownload(scene.videoUrl!, `scene_${scene.id}_video.mp4`)}
                        className="absolute top-2 right-2 bg-white bg-opacity-60 text-black p-2 rounded-full hover:bg-opacity-80 transition"
                        aria-label="Unduh Video"
                    >
                        <DownloadIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
        
        {/* Info and Actions Column */}
        <div className="bg-white h-full flex flex-col justify-between">
          <div>
            <h4 className="text-md font-bold text-gray-900">{scene.title}</h4>
            <p className="text-xs text-gray-500 mb-3">{scene.description}</p>
            
            <div className="space-y-2 mb-4">
                <button 
                    onClick={() => onRegenerateImage(scene.id)} 
                    disabled={isActionInProgress}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RegenerateIcon className="w-3 h-3" />
                    Buat Ulang Gambar
                </button>
            </div>
            
            {isVoiceOverEnabled && (
                <div className="mb-4">
                    <label htmlFor={`script-${scene.id}`} className="text-sm font-semibold text-gray-600 mb-1 block">
                      Naskah Voice Over
                    </label>
                    <textarea 
                        id={`script-${scene.id}`}
                        rows={4}
                        value={scene.script}
                        onChange={(e) => onScriptChange(scene.id, e.target.value)}
                        placeholder="Tulis naskah untuk adegan ini..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                        disabled={isActionInProgress}
                    />
                </div>
            )}

            <div>
                <label htmlFor={`video-prompt-${scene.id}`} className="text-sm font-semibold text-gray-600 mb-1 block">
                    Prompt Animasi Video
                </label>
                <textarea 
                    id={`video-prompt-${scene.id}`}
                    rows={4}
                    value={scene.videoPrompt}
                    onChange={(e) => onVideoPromptChange(scene.id, e.target.value)}
                    placeholder="Contoh: 'model menunjukkan produk sambil tersenyum'"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                    disabled={isActionInProgress}
                />
            </div>
          </div>
          <div className="mt-4">
            <button 
                onClick={() => onGenerateVideo(scene.id, scene.videoPrompt)}
                disabled={isActionInProgress || ![GenerationStatus.IMAGE_READY, GenerationStatus.COMPLETED, GenerationStatus.ERROR].includes(scene.status)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <VideoIcon className="w-4 h-4" />
                Buat Video
            </button>
            {scene.status === GenerationStatus.ERROR && scene.errorMessage && (
               <p className="text-red-500 text-xs mt-2">Error: {scene.errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;