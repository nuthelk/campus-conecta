import { StickyNote, Download } from "lucide-react";

interface ArchiveProps {
  name: string;
  url: string;
  extension?: string;
}

const Archive = ({ name, url, extension }: ArchiveProps) => {
  const handleDownload = () => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="rounded-[10px] bg-[#4F82C0] max-w-[300px] p-3 flex items-center gap-2 justify-between cursor-pointer hover:bg-[#3a6ba8] transition-colors mb-6"
      onClick={handleDownload}
    >
      <div className="flex items-center gap-2">
        <StickyNote size={30} className="text-white" />
        <div className="flex flex-col">
          <p className="text-white font-semibold text-base truncate max-w-[200px]">
            {name}
          </p>
          {extension && (
            <p className="text-white/80 text-xs">.{extension.toLowerCase()}</p>
          )}
        </div>
      </div>
      <Download className="text-white" />
    </div>
  );
};

export default Archive;
