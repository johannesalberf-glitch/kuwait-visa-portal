import {
  lookupVisaFn,
  listVisasFn,
  saveVisaFn,
  updateVisaFn,
  deleteVisaFn,
  clearAllVisasFn,
  type VisaRecord,
  type VisaDocument,
} from "./visa-storage.functions";

export type { VisaRecord, VisaDocument };

export async function saveVisa(record: VisaRecord): Promise<void> {
  await saveVisaFn({ data: { record } });
}

export async function findVisa(id: string): Promise<VisaRecord | null> {
  const res = await lookupVisaFn({ data: { id } });
  return res.record;
}

export async function listVisas(): Promise<VisaRecord[]> {
  const res = await listVisasFn();
  return res.records;
}

export async function updateVisa(id: string, record: VisaRecord): Promise<void> {
  await updateVisaFn({ data: { id, record } });
}

export async function deleteVisa(id: string): Promise<void> {
  await deleteVisaFn({ data: { id } });
}

export async function clearAllVisas(): Promise<void> {
  await clearAllVisasFn();
}
