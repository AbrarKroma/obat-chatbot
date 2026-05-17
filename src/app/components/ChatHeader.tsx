export default function ChatHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Ooredoo Logo */}
          <div className="w-12 h-12 bg-[#e60000] rounded-lg flex items-center justify-center">
            <span className="text-white">O</span>
          </div>
          <div>
            <h1 className="text-gray-900">
              Obot Business – AI Support Assistant
            </h1>
            <p className="text-gray-500 text-sm">
              Powered by Ooredoo Enterprise AI
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
