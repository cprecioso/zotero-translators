export interface Reference extends unknown {}

export type ExportFormat =
  | "bibtex"
  | "biblatex"
  | "bookmarks"
  | "coins"
  | "csljson"
  | "csv"
  | "endnote_xml"
  | "evernote"
  | "mods"
  | "rdf_bibliontology"
  | "rdf_dc"
  | "rdf_zotero"
  | "refer"
  | "refworks_tagged"
  | "ris"
  | "tei"
  | "wikipedia"

export function search(query: string): Promise<Reference[]>

export function referenceImport(data: string): Promise<Reference[]>

export function referenceExport(
  format: ExportFormat,
  items: Reference[]
): Promise<unknown>
