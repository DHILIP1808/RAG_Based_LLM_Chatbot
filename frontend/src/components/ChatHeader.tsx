import { Sprout, Leaf, Sun } from 'lucide-react';

const ChatHeader = () => {
  return (
    <div className="relative bg-white px-6 py-5 shadow-lg border-b border-gray-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-10 text-emerald-500/20">
          <Leaf size={24} />
        </div>
        <div className="absolute top-4 right-20 text-green-500/20">
          <Sprout size={20} />
        </div>
        <div className="absolute bottom-2 left-1/3 text-amber-500/20">
          <Sun size={18} />
        </div>
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-100 rounded-full">
            <Sprout size={28} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
              AgroMind AI
            </h1>
            <p className="text-gray-600 text-sm">Your Smart Assistant For Learning Agriculture</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700 text-sm font-medium">GPT-4o-mini</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;