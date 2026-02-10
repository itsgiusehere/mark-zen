import { useSystemTheme } from '@/hooks/useSystemTheme';
import MarkdownEditor from '@/components/MarkdownEditor';

const Index = () => {
  useSystemTheme();

  return <MarkdownEditor />;
};

export default Index;
