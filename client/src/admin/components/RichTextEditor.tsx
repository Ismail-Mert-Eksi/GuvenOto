// src/components/RichTextEditor.tsx
import React, { useMemo } from "react";
import JoditEditor from "jodit-react";
import "jodit/es5/jodit.min.css";

type ToolbarPreset = "basic" | "full";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  height?: number;             // px
  disabled?: boolean;
  toolbar?: ToolbarPreset | string; // "basic" | "full" | custom buttons string
};

const BUTTONS: Record<ToolbarPreset, string> = {
  basic:
    "bold,italic,underline,|,ul,ol,|,link,|,align,left,center,right,|,hr,undo,redo,|,eraser,source",
  full:
    "source,|,bold,italic,underline,strikethrough,|,ul,ol,|,font,fontsize,brush,paragraph,|,image,table,link,|,left,center,right,justify,|,lineHeight,indent,outdent,|,hr,eraser,undo,redo,|,selectall,copy,cut,paste",
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "İlan detayını yazın...",
  height = 360,
  disabled = false,
  toolbar = "basic",
}) => {
  const buttons =
    toolbar === "basic" || toolbar === "full" ? BUTTONS[toolbar] : toolbar;

  // Jodit config (tip uyuşmazlığı olmasın diye 'any' atadık; paket tipleri buna izin veriyor)
  const config = useMemo<any>(
    () => ({
      readonly: !!disabled,
      height,
      placeholder,
      toolbarSticky: false,
      toolbarAdaptive: true,
      buttons,
      // Görselleri base64 olarak gömmeyelim; sen zaten CDN kullanıyorsun (Cloudinary/ImageKit)
      uploader: { insertImageAsBase64URI: true },
      // Yapıştırma UX’i:
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      // Bazı kullanıcılar için sade görünüm iyi oluyor:
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
    }),
    [disabled, height, placeholder, buttons]
  );

  return (
    <div className="w-full">
      <JoditEditor
        value={value}
        // Jodit bazen onChange'i çok sık tetikliyor; genelde onBlur kullanmak daha stabil
        onBlur={(newContent) => onChange(newContent)}
        onChange={() => {}}
        config={config}
      />
    </div>
  );
};

export default RichTextEditor;
