export default function SidebarHeader() {
  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <h1 className="text-xl font-semibold">Perplexity Clone</h1>
      </div>
    </div>
  );
}
