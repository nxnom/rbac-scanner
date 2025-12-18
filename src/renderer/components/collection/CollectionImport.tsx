import { Button } from '@geckoui/geckoui';
import { useCollection } from '../../context/CollectionContext';
import { useVariables } from '../../context/VariablesContext';
import { parseCollection, flattenEndpoints } from '../../utils/postmanParser';
import { extractVariablesWithRequired } from '../../utils/variableExtractor';

export function CollectionImport() {
  const { setCollection } = useCollection();
  const { setVariablesFromExtracted } = useVariables();

  const handleImport = async () => {
    const result = await window.electronAPI.openFileDialog();

    if (result.canceled || !result.content) {
      return;
    }

    setCollection(result.content);

    const parsed = parseCollection(result.content);
    const flatEndpoints = flattenEndpoints(parsed.item);
    const vars = extractVariablesWithRequired(flatEndpoints);
    setVariablesFromExtracted(vars);
  };

  return (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-gray-500 mb-4">No collection imported</p>
      <Button onClick={handleImport}>Import Postman Collection</Button>
    </div>
  );
}
