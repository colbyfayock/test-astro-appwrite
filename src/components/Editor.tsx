import { Editor as NovelEditor } from 'novel';

const defaultContent = {
  "type": "doc",
  "content": []
};

const Editor = (props: React.ComponentProps<typeof NovelEditor>) => {
  return (
    <NovelEditor
      className="relative w-full min-h-[200px] border border-1 border-slate-400 rounded"
      disableLocalStorage
      defaultValue={defaultContent}
      {...props}
    />
  );
}

export default Editor;