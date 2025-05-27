
'use server';

export interface StoredFile {
  id: string;
  fileName: string;
  mimeType: string;
  data: Buffer;
  size: number;
}

// THIS IS NOT FOR PRODUCTION USE - data is lost on server restart, has memory limits, and no cleanup.
const fileStorage = new Map<string, StoredFile>();

export function addFileToStore(file: StoredFile): void {
  fileStorage.set(file.id, file);
  // console.log(`File added to store: ${file.id}, store size: ${fileStorage.size}`);
}

export function getFileFromStore(id: string): StoredFile | undefined {
  const file = fileStorage.get(id);
  // console.log(`File retrieved from store: ${id}, found: ${!!file}`);
  return file;
}

// TODO: Implement cleanup logic, e.g., removeFileFromStore(id: string)
// export function removeFileFromStore(id: string): void {
//   fileStorage.delete(id);
// }
