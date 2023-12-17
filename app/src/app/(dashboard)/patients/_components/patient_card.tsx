import Link from "next/link";
import {
  HiMiniArchiveBoxArrowDown,
  HiMiniFolderOpen,
  HiOutlineDocument,
  HiOutlineDocumentText,
  HiOutlineFilm,
  HiOutlineGif,
  HiOutlinePhoto,
  HiOutlineSpeakerWave,
} from "react-icons/hi2";

import { createServerClientAndGetSession } from "@/utils/supabase";

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
const humanFileSize = (
  bytes: number | null,
  si: boolean = true,
  dp: number = 0,
) => {
  if (!bytes) {
    return "unknown size";
  }

  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
};

const PatientCard = async ({ patientId }: { patientId: string }) => {
  const { supabase } = await createServerClientAndGetSession();

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .single();
  // TODO: handle no patient data
  if (!patient) {
    return <PatientCardSkeleton />;
  }

  const { data: patientData } = await supabase.storage
    .from("clinic-data")
    .list(`${patient.clinic_id}/${patient.id}`);
  if (!patientData) {
    return <PatientCardSkeleton />;
  }

  const patientInitials = patient.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mb-auto flex w-96 flex-col divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
      <div className="flex flex-row items-center gap-4 p-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-500">
          <span className="text-lg font-medium leading-none text-white">
            {patientInitials}
          </span>
        </span>
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{patient.name}</p>
          <p className="text-sm text-gray-500">{patientData.length} files</p>
        </div>
        {/* TODO: implement favorite
        <button className="group ml-auto p-1">
          <span className="sr-only">Favorite</span>
          <HiOutlineStar className="h-5 w-5 text-gray-500 group-hover:text-yellow-300" />
        </button>
        */}
      </div>

      <ul className="flex flex-col">
        {patientData.slice(0, 3).map((file) => {
          // TODO: reimplment downloading
          // const downloadUrl = (
          //   await supabase.storage
          //     .from("clinic-data")
          //     .createSignedUrl(
          //       `${patient.clinic_id}/${patient.id}/${file.name}`,
          //       60,
          //     )
          // ).data?.signedUrl;

          switch (file.metadata.mimetype.split("/")[0]) {
            case "image":
              var FileIcon = HiOutlinePhoto;
              break;
            case "audio":
              var FileIcon = HiOutlineSpeakerWave;
              break;
            case "application":
              var FileIcon = HiOutlineDocument;
              break;
            case "text":
              var FileIcon = HiOutlineDocumentText;
              break;
            case "video":
              var FileIcon = HiOutlineFilm;
              break;
            default:
              var FileIcon = HiOutlineDocument;
          }

          switch (file.metadata.mimetype) {
            case "image/gif":
              var FileIcon = HiOutlineGif;
              break;
            default:
              var FileIcon = FileIcon;
          }

          return (
            <li
              key={file.id}
              className="group flex flex-row items-center px-4 py-2 odd:bg-white even:bg-gray-50"
            >
              <FileIcon className="mr-2 h-4 w-4 text-gray-500" />
              <p className="text-sm">{file.name}</p>
              <div className="invisible ml-auto mr-2 flex flex-col text-right text-xs text-gray-400 group-hover:visible">
                <span>size: {humanFileSize(file.metadata.size ?? null)}</span>
              </div>
              {/* {downloadUrl ? (
                <Link
                  href={downloadUrl}
                  title="Download this file"
                  className="rounded-lg p-2 text-gray-500 hover:text-blue-500 hover:shadow-inner focus:text-blue-500 focus:shadow-inner"
                >
                  <HiMiniArrowDownTray className="h-4 w-4" />
                </Link>
              ) : (
                <div title="Could not get download URL">
                  <HiMiniNoSymbol className="h-4 w-4 text-gray-500" />
                </div>
              )} */}
            </li>
          );
        })}
        {patientData.length > 3 ? (
          <li className="flex flex-row items-center px-4 py-2 odd:bg-white even:bg-gray-50">
            <p className="text-xs text-gray-500">
              ... and {patientData.length - 3} more file
            </p>
          </li>
        ) : null}
      </ul>

      <div className="flex flex-row gap-2 p-4">
        <Link
          // TODO: implement file search
          href={`/files?search=${patient.id}`}
          title="View patient files in the file manager"
          className="group rounded-lg p-2 hover:shadow-inner focus:shadow-inner"
        >
          <HiMiniFolderOpen className="h-5 w-5 text-gray-500 group-hover:text-blue-500 group-focus:text-blue-500" />
        </Link>
        <Link
          // TODO: implement download and move it to a server action or something
          href={`/patients/${patient.id}/download`}
          title="Download all patient files"
          className="group rounded-lg p-2 hover:shadow-inner focus:shadow-inner"
        >
          <HiMiniArchiveBoxArrowDown className="h-5 w-5 text-gray-500 group-hover:text-blue-500 group-focus:text-blue-500" />
        </Link>
      </div>
    </div>
  );
};

const PatientCardSkeleton = () => (
  <div className="flex w-96 flex-col divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
    <div className="flex flex-row items-center gap-4 p-6">
      <span className="inline-flex h-12 w-12 shrink-0 animate-pulse items-center justify-center rounded-full bg-gray-300" />
      <div className="flex w-full flex-col gap-1">
        <div className="w-1/3 animate-pulse rounded-lg bg-gray-200 p-2" />
        <div className="w-1/2 animate-pulse rounded-lg bg-gray-200 p-2" />
      </div>
    </div>

    <ul className="flex flex-col gap-1 p-4">
      <li className="w-2/3 animate-pulse rounded-lg bg-gray-200 p-2" />
      <li className="w-1/2 animate-pulse rounded-lg bg-gray-200 p-2" />
      <li className="w-3/4 animate-pulse rounded-lg bg-gray-200 p-2" />
    </ul>

    <div className="flex flex-row gap-2 p-4">
      <div className="w-1/3 animate-pulse rounded-lg bg-gray-200 p-4" />
    </div>
  </div>
);
PatientCard.Skeleton = PatientCardSkeleton;

export default PatientCard;
