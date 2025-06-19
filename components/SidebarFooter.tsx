export default function SidebarFooter() {
  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">👤</span>
        </div>
        <div>
          <div className="text-sm font-medium">User</div>
          <div className="text-xs text-gray-500">user@example.com</div>
        </div>
      </div>
    </div>
  );
}
